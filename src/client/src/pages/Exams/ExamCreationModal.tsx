import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { TextField, styled } from '@mui/material';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';

function ExamCreationModal(props: {
    isOpen: boolean;
    close: () => void;
    onExamCreated: (examId: string) => void;
}) {
    const [newExamName, setNewExamName] = useState('');
    const [newExamDuration, setNewExamDuration] = useState(60);
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
            <>
                <FieldContainer>
                    <TextField
                        label="Nom du test"
                        fullWidth
                        value={newExamName}
                        onChange={(event) => setNewExamName(event.target.value)}
                    />
                </FieldContainer>
                <FieldContainer>
                    <TextField
                        type="number"
                        label="Durée du test en minutes"
                        value={newExamDuration}
                        onChange={(event) => setNewExamDuration(Number(event.target.value))}
                    />
                </FieldContainer>
            </>
        </Modal>
    );

    async function createExam() {
        mutation.mutate({ name: newExamName, duration: newExamDuration });
    }
}

const FieldContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    width: '100%',
}));

export { ExamCreationModal };
