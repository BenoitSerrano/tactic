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
            props.close();
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
            title="Création d'un nouveau test"
        >
            <div>
                <TextField
                    label="Nom du test"
                    fullWidth
                    value={newExamName}
                    onChange={(event) => setNewExamName(event.target.value)}
                />
                <TextField
                    type="number"
                    label="Durée du test en minutes"
                    value={newExamDuration}
                    onChange={(event) => setNewExamDuration(Number(event.target.value))}
                />
            </div>
        </Modal>
    );

    async function createExam() {
        mutation.mutate({ name: newExamName, duration: newExamDuration });
    }
}

export { ExamCreationModal };
