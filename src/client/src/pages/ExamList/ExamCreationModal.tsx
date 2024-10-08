import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FormControlLabel, Radio, RadioGroup, TextField, styled } from '@mui/material';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { INTEGER_NUMBER_REGEX } from '../../constants';
import { computeIsConfirmDisabled } from './lib/computeIsConfirmDisabled';
import { EXAM_DEFAULT_DURATION } from './constants';
import { useAlert } from '../../lib/alert';

function ExamCreationModal(props: {
    close: () => void;
    isOpen: boolean;
    onExamCreated: (examId: string) => void;
}) {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState(`${EXAM_DEFAULT_DURATION}`);
    const [isThereDuration, setIsThereDuration] = useState(true);
    const { displayAlert } = useAlert();

    const createExamMutation = useMutation({
        mutationFn: api.createExam,
        onSuccess: (exam) => {
            setDuration(`${EXAM_DEFAULT_DURATION}`);
            setName('');
            setIsThereDuration(true);
            props.onExamCreated(exam.id);
            props.close();
        },
        onError: (error) => {
            displayAlert({ text: error.message, variant: 'error', autoHideDuration: 3000 });
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
                        label="Nom de l'examen"
                        fullWidth
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </FieldContainer>
                <FieldContainer>
                    <StyledRadioGroup
                        value={isThereDuration ? '1' : '0'}
                        onChange={onChangeIsThereDuration}
                    >
                        <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label={
                                <TextField
                                    disabled={!isThereDuration}
                                    type="number"
                                    label="Durée de l'examen en minutes"
                                    value={duration}
                                    onChange={onChangeDuration}
                                />
                            }
                        />
                        <FormControlLabel
                            value="0"
                            control={<Radio />}
                            label="Cet examen n'a pas de durée"
                        />
                    </StyledRadioGroup>
                </FieldContainer>
            </>
        </Modal>
    );

    function onChangeIsThereDuration(event: React.ChangeEvent<HTMLInputElement>) {
        setIsThereDuration(event.target.value === '1');
    }

    function onChangeDuration(event: React.ChangeEvent<HTMLInputElement>) {
        const newDuration = event.target.value;
        if (newDuration.match(INTEGER_NUMBER_REGEX)) {
            setDuration(newDuration);
        }
    }

    function saveExam() {
        const newExam = {
            duration: isThereDuration ? Number(duration) : undefined,
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
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
}));

const StyledRadioGroup = styled(RadioGroup)({
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
});

export { ExamCreationModal };
