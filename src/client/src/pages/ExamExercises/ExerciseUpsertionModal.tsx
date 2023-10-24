import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { modalStatusType } from './types';
import { TextField } from '@mui/material';
import { FLOATING_NUMBER_REGEX } from '../../constants';

function ExerciseUpsertionModal(props: {
    close: () => void;
    modalStatus: modalStatusType;
    examId: string;
}) {
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();

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

    const isUpdating = updateExerciseMutation.isLoading;
    const isCreating = createExerciseMutation.isLoading;

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
                <TextField
                    name="name"
                    fullWidth
                    label="Nom de l'exercice"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                <TextField
                    name="instruction"
                    label="Consigne"
                    multiline
                    fullWidth
                    minRows={2}
                    value={instruction}
                    onChange={(event) => setInstruction(event.target.value)}
                />
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
                ...newExercise,
            });
        }
    }
}

export { ExerciseUpsertionModal };
