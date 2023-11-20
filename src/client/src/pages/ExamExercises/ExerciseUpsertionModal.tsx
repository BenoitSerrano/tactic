import { useState } from 'react';
import { Editable, useEditor } from '@wysimark/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { modalStatusType } from './types';
import { MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { FLOATING_NUMBER_REGEX, questionSpecificityMapping } from '../../constants';
import { questionKindType, questionKinds } from '../../types';
import { config } from '../../config';

function ExerciseUpsertionModal(props: {
    close: () => void;
    modalStatus: modalStatusType;
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
                queryKey: ['exams', props.examId],
            });
        },
    });

    const createExerciseMutation = useMutation({
        mutationFn: api.createExercise,
        onSuccess: () => {
            props.close();
            displayAlert({ text: "L'exercice a bien été créé.", variant: 'success' });
            queryClient.invalidateQueries({
                queryKey: ['exams', props.examId],
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
                    <Select
                        fullWidth
                        labelId="select-default-question-kind-label"
                        id="select-default-question-kind"
                        value={defaultQuestionKind}
                        label="Type de question"
                        onChange={handleQuestionKindChange}
                    >
                        {questionKinds.map((questionKind) => (
                            <MenuItem value={questionKind}>
                                {questionSpecificityMapping[questionKind].label}
                            </MenuItem>
                        ))}
                    </Select>
                )}

                <TextField
                    name="name"
                    fullWidth
                    label="Nom de l'exercice"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                <Editable editor={editor} value={instruction} onChange={setInstruction} />

                <TextField
                    name="defaultPoints"
                    label="Nombre de points par question par défaut"
                    value={defaultPoints}
                    onChange={onChangeDefaultPoints}
                />
            </>
        </Modal>
    );

    function onChangeDefaultPoints(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(FLOATING_NUMBER_REGEX)) {
            setDefaultPoints(value);
        }
    }

    function handleQuestionKindChange(event: SelectChangeEvent) {
        const newDefaultQuestionKind = event.target.value as questionKindType;
        setDefaultQuestionKind(newDefaultQuestionKind);
    }

    function saveExercise() {
        const newExercise = {
            name,
            instruction,
            defaultPoints: Number(defaultPoints),
        };
        if (props.modalStatus?.kind === 'editing') {
            updateExerciseMutation.mutate({
                examId: props.examId,
                exerciseId: props.modalStatus.exercise.id,
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

export { ExerciseUpsertionModal };
