import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField, styled } from '@mui/material';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { INTEGER_NUMBER_REGEX } from '../../constants';
import { computeIsConfirmDisabled } from './lib/computeIsConfirmDisabled';

const DEFAULT_DURATION = 60;

function ExamUpsertionModal(props: {
    close: () => void;
    isOpen: boolean;
    onExamCreated: () => void;
}) {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState(`${DEFAULT_DURATION}`);
    const queryClient = useQueryClient();

    const createExamMutation = useMutation({
        mutationFn: api.createExam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
            props.onExamCreated();
            props.close();
        },
    });

    const isConfirmDisabled = computeIsConfirmDisabled({ name, duration });
    const isCreating = createExamMutation.isPending;

    return (
        <Modal
            size="small"
            isOpen={props.isOpen}
            close={props.close}
            onConfirm={saveExam}
            confirmButtonLabel="Créer"
            cancelButtonLabel="Annuler"
            isConfirmDisabled={isConfirmDisabled}
            isConfirmLoading={isCreating}
            title="Création d'un examen"
        >
            <>
                <FieldContainer>
                    <TextField
                        autoFocus
                        label="Nom du test"
                        fullWidth
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </FieldContainer>
                <FieldContainer>
                    <TextField
                        type="number"
                        label="Durée du test en minutes"
                        value={duration}
                        onChange={onChangeDuration}
                    />
                </FieldContainer>
            </>
        </Modal>
    );

    function onChangeDuration(event: React.ChangeEvent<HTMLInputElement>) {
        const newDuration = event.target.value;
        if (newDuration.match(INTEGER_NUMBER_REGEX)) {
            setDuration(newDuration);
        }
    }

    function saveExam() {
        const newExam = {
            duration: Number(duration),
            name,
        };
        createExamMutation.mutate({
            ...newExam,
        });
    }
}

const FieldContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    width: '100%',
}));

export { ExamUpsertionModal };
