import { useState } from 'react';
import { Editable, useEditor } from '@wysimark/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField, styled } from '@mui/material';
import { config } from '../../../config';
import { useAlert } from '../../../lib/alert';
import { questionKindType } from '../../../types';
import { api } from '../../../lib/api';
import { Modal } from '../../../components/Modal';
import { QuestionKindSelect } from '../components/QuestionKindSelect';
import { FLOATING_NUMBER_REGEX } from '../../../constants';
import { exerciseUpsertionModalStatusType } from './types';

function ExerciseUpsertionModal(props: {
    close: () => void;
    modalStatus: exerciseUpsertionModalStatusType;
    onCreateExercise: (createdExerciseId: number) => void;
    examId: string;
}) {
    const queryClient = useQueryClient();
    const editor = useEditor({ authToken: config.PORTIVE_AUTH_TOKEN });
    const { displayAlert } = useAlert();

    const [defaultQuestionKind, setDefaultQuestionKind] = useState<questionKindType>('qcm');

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

    const [defaultPoints, setDefaultPoints] = useState(
        props.modalStatus.kind === 'editing' ? `${props.modalStatus.exercise.defaultPoints}` : '1',
    );

    const isUpdating = updateExerciseMutation.isPending;
    const isCreating = createExerciseMutation.isPending;

    const confirmButtonLabel = props.modalStatus.kind === 'creating' ? 'Ajouter' : 'Modifier';
    const titlePrefix = props.modalStatus.kind === 'creating' ? 'Création' : 'Édition';
    const isConfirmDisabled = !name || !defaultPoints;

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
                    <TextField
                        name="defaultPoints"
                        label="Nombre de points par question par défaut"
                        value={defaultPoints}
                        onChange={onChangeDefaultPoints}
                    />
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

    function saveExercise() {
        const { modalStatus } = props;
        if (!modalStatus) {
            return;
        }
        const newExercise = {
            name,
            instruction,
            defaultPoints: Number(defaultPoints),
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
                defaultQuestionKind,
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

export { ExerciseUpsertionModal };
