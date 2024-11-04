import { useState } from 'react';
import { Editable, useEditor } from '@wysimark/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    TextField,
    Typography,
    styled,
} from '@mui/material';
import { config } from '../../../config';
import { useAlert } from '../../../lib/alert';
import { questionKindType } from '../../../types';
import { api } from '../../../lib/api';
import { Modal } from '../../../components/Modal';
import { QuestionKindSelect } from '../components/QuestionKindSelect';
import { FLOATING_NUMBER_REGEX } from '../../../constants';
import { exerciseUpsertionModalStatusType } from './types';

type pointsModeType = 'individually' | 'allAtOnce';

function ExerciseUpsertionModal(props: {
    close: () => void;
    modalStatus: exerciseUpsertionModalStatusType;
    onCreateExercise: (createdExerciseId: number) => void;
    examId: string;
}) {
    const queryClient = useQueryClient();
    const editor = useEditor({ authToken: config.PORTIVE_AUTH_TOKEN });
    const { displayAlert } = useAlert();

    const initialQuestionKind =
        props.modalStatus.kind === 'creating'
            ? 'qcm'
            : props.modalStatus.exercise.defaultQuestionKind;
    const [defaultQuestionKind, setDefaultQuestionKind] =
        useState<questionKindType>(initialQuestionKind);

    const updateExerciseMutation = useMutation({
        mutationFn: api.updateExercise,
        onSuccess: () => {
            props.close();
            displayAlert({ text: "L'exercice a bien été modifié.", variant: 'success' });
            queryClient.invalidateQueries({
                queryKey: ['exam-with-questions', props.examId],
            });
        },
    });

    const createExerciseMutation = useMutation({
        mutationFn: api.createExercise,
        onSuccess: (createdExercise: { id: number }) => {
            props.onCreateExercise(createdExercise.id);
            props.close();
            displayAlert({ text: "L'exercice a bien été créé.", variant: 'success' });
            queryClient.invalidateQueries({
                queryKey: ['exam-with-questions', props.examId],
            });
        },
    });

    const [name, setName] = useState(
        props.modalStatus.kind === 'editing' ? props.modalStatus.exercise.name : '',
    );
    const [instruction, setInstruction] = useState(
        props.modalStatus.kind === 'editing' ? props.modalStatus.exercise.instruction : '',
    );

    const initialDefaultPoints = computeInitialDefaultPoints();
    const [defaultPoints, setDefaultPoints] = useState(initialDefaultPoints);
    const initialPointMode = computeInitialPointMode();
    const [pointsMode, setPointsMode] = useState<pointsModeType>(initialPointMode);

    const isUpdating = updateExerciseMutation.isPending;
    const isCreating = createExerciseMutation.isPending;

    const confirmButtonLabel = props.modalStatus.kind === 'creating' ? 'Ajouter' : 'Modifier';
    const titlePrefix = props.modalStatus.kind === 'creating' ? 'Création' : 'Édition';
    const isConfirmDisabled = computeIsConfirmDisabled();

    return (
        <Modal
            isOpen={!!props.modalStatus}
            close={props.close}
            onConfirm={saveExercise}
            confirmButtonLabel={confirmButtonLabel}
            cancelButtonLabel="Annuler"
            isConfirmLoading={isUpdating || isCreating}
            title={`${titlePrefix} d'un exercice`}
            isConfirmDisabled={isConfirmDisabled}
        >
            <>
                {props.modalStatus.kind === 'creating' && (
                    <RowContainer>
                        <QuestionKindSelect
                            currentQuestionKind={defaultQuestionKind}
                            onSelect={setDefaultQuestionKind}
                        />
                    </RowContainer>
                )}
                <RowContainer>
                    <TextField
                        autoFocus
                        fullWidth
                        name="name"
                        label="Nom de l'exercice"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </RowContainer>
                <RowContainer>
                    <Editable editor={editor} value={instruction} onChange={setInstruction} />
                </RowContainer>
                <RowContainer>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-classe-label">
                            Points attribués à chaque question
                        </FormLabel>

                        <FormControlLabel
                            control={
                                <Radio
                                    checked={pointsMode === 'allAtOnce'}
                                    onChange={(_event, checked) =>
                                        setPointsMode(checked ? 'allAtOnce' : 'individually')
                                    }
                                />
                            }
                            label={
                                <LabelContainer>
                                    <Label>
                                        Attribuer le même nombre de points pour toutes les questions
                                        de cet exercice :
                                    </Label>
                                    <PointsTextField
                                        disabled={pointsMode === 'individually'}
                                        variant="standard"
                                        name="defaultPoints"
                                        value={defaultPoints}
                                        onChange={onChangeDefaultPoints}
                                    />
                                    <Typography>point(s)</Typography>
                                </LabelContainer>
                            }
                        />
                        <FormControlLabel
                            value="individually"
                            control={
                                <Radio
                                    checked={pointsMode === 'individually'}
                                    onChange={(_event, checked) =>
                                        setPointsMode(checked ? 'individually' : 'allAtOnce')
                                    }
                                />
                            }
                            label="Définir le nombre de points pour chaque question individuellement"
                        />
                    </FormControl>
                </RowContainer>
            </>
        </Modal>
    );

    function onChangeDefaultPoints(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(FLOATING_NUMBER_REGEX)) {
            setDefaultPoints(value);
        }
    }

    function computeIsConfirmDisabled(): boolean {
        if (!name) {
            return true;
        }
        switch (pointsMode) {
            case 'individually':
                return false;
            case 'allAtOnce':
                return !defaultPoints;
        }
    }

    function computeInitialPointMode(): pointsModeType {
        switch (props.modalStatus.kind) {
            case 'creating':
                return 'allAtOnce';
            case 'editing':
                if (props.modalStatus.exercise.defaultPoints === null) {
                    return 'individually';
                } else {
                    return 'allAtOnce';
                }
        }
    }

    function computeInitialDefaultPoints(): string {
        switch (props.modalStatus.kind) {
            case 'creating':
                return '1';
            case 'editing':
                if (props.modalStatus.exercise.defaultPoints === null) {
                    return '';
                } else {
                    return `${props.modalStatus.exercise.defaultPoints}`;
                }
        }
    }

    function saveExercise() {
        const { modalStatus } = props;
        if (!modalStatus) {
            return;
        }
        const newExercise = {
            name,
            instruction,
            defaultPoints: pointsMode === 'allAtOnce' ? Number(defaultPoints) : null,
            defaultQuestionKind,
        };
        if (modalStatus.kind === 'editing') {
            updateExerciseMutation.mutate({
                examId: props.examId,
                exerciseId: modalStatus.exercise.id,
                ...newExercise,
            });
        } else {
            createExerciseMutation.mutate({
                examId: props.examId,
                ...newExercise,
            });
        }
    }
}

const RowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    width: '100%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

const PointsTextField = styled(TextField)(({ theme }) => ({
    width: 50,
    marginRight: theme.spacing(1),
}));
const LabelContainer = styled('div')({ display: 'flex', alignItems: 'center' });
const Label = styled(Typography)(({ theme }) => ({ marginRight: theme.spacing(1) }));

export { ExerciseUpsertionModal };
