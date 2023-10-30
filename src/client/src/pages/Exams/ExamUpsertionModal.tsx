import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField, styled } from '@mui/material';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { modalStatusType } from './types';
import { INTEGER_NUMBER_REGEX } from '../../constants';
import { computeIsConfirmDisabled } from './lib/computeIsConfirmDisabled';

const DEFAULT_DURATION = 60;

function ExamUpsertionModal(props: { close: () => void; modalStatus: modalStatusType }) {
    const [name, setName] = useState(
        props.modalStatus.kind === 'editing' ? props.modalStatus.exam.name : '',
    );
    const [duration, setDuration] = useState(
        props.modalStatus.kind === 'editing'
            ? `${props.modalStatus.exam.duration}`
            : `${DEFAULT_DURATION}`,
    );
    const queryClient = useQueryClient();

    const createExamMutation = useMutation({
        mutationFn: api.createExam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });

            if (props.modalStatus.kind === 'creating') {
                props.modalStatus.onExamCreated();
            }
            props.close();
        },
    });
    const updateExamMutation = useMutation({
        mutationFn: api.updateExam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });

            props.close();
        },
    });

    const isConfirmDisabled = computeIsConfirmDisabled({ name, duration });
    const isCreating = createExamMutation.isPending;
    const isUpdating = updateExamMutation.isPending;
    const confirmButtonLabel = props.modalStatus.kind === 'creating' ? 'Créer' : 'Modifier';
    const titlePrefix = props.modalStatus.kind === 'creating' ? 'Création' : 'Édition';

    return (
        <Modal
            isOpen={!!props.modalStatus}
            close={props.close}
            onConfirm={saveExam}
            confirmButtonLabel={confirmButtonLabel}
            cancelButtonLabel="Annuler"
            isConfirmDisabled={isConfirmDisabled}
            isConfirmLoading={isUpdating || isCreating}
            title={`${titlePrefix} d'un test`}
        >
            <>
                <FieldContainer>
                    <TextField
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
        if (props.modalStatus.kind === 'editing') {
            updateExamMutation.mutate({
                examId: props.modalStatus.exam.id,
                ...newExam,
            });
        } else {
            createExamMutation.mutate({
                ...newExam,
            });
        }
    }
}

const FieldContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    width: '100%',
}));

export { ExamUpsertionModal };
