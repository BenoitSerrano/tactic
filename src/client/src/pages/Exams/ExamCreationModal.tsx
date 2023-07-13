import React, { useState } from 'react';
import { Modal } from '../../components/Modal';
import { TextField } from '@mui/material';
import { api } from '../../lib/api';
import { useMutation } from '@tanstack/react-query';

function ExamCreationModal(props: {
    isOpen: boolean;
    close: () => void;
    onExamCreated: (examId: string) => void;
}) {
    const [newExamName, setNewExamName] = useState('');
    const [newExamDuration, setNewExamDuration] = useState(15);
    const mutation = useMutation({
        mutationFn: api.createExam,
        onSuccess: (exam) => {
            props.onExamCreated(exam.id);
        },
    });

    return (
        <Modal
            isOpen={props.isOpen}
            close={props.close}
            onConfirm={createExam}
            confirmButtonLabel="Créer"
            cancelButtonLabel="Annuler"
            isConfirmLoading={mutation.isLoading}
        >
            <TextField
                label="Nom de l'examen"
                placeholder="..."
                value={newExamName}
                onChange={(event) => setNewExamName(event.target.value)}
            />
            <TextField
                type="number"
                label="Durée de l'examen en minutes"
                placeholder="..."
                value={newExamDuration}
                onChange={(event) => setNewExamDuration(Number(event.target.value))}
            />
        </Modal>
    );

    async function createExam() {
        mutation.mutate({ name: newExamName, duration: newExamDuration });
    }
}

export { ExamCreationModal };
