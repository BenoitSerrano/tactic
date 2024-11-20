import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FormControlLabel, Radio, RadioGroup, TextField, styled } from '@mui/material';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { INTEGER_NUMBER_REGEX } from '../../constants';
import { computeIsConfirmDisabled } from './lib/computeIsConfirmDisabled';
import { EXAM_DEFAULT_DURATION } from '../ExamList/constants';
import { useAlert } from '../../lib/alert';
import { SelectExamExtremums } from './SelectExamExtremums';

function ExamCreationModal(props: {
    close: () => void;
    isOpen: boolean;
    establishmentId: string;
    classe: { id: string; name: string };
    onExamCreated: (examId: string) => void;
}) {
    const [name, setName] = useState('');

    const [startDateTime, setStartDateTime] = useState<number | undefined>();
    const [endDateTime, setEndDateTime] = useState<number | undefined>(Infinity);
    const [duration, setDuration] = useState(`${EXAM_DEFAULT_DURATION}`);
    const [isThereDuration, setIsThereDuration] = useState(true);
    const { displayAlert } = useAlert();

    const createExamMutation = useMutation({
        mutationFn: api.createExam,
        onSuccess: (exam) => {
            setDuration(`${EXAM_DEFAULT_DURATION}`);
            setName('');
            setIsThereDuration(true);
            setStartDateTime(undefined);
            setEndDateTime(undefined);
            props.onExamCreated(exam.id);
            props.close();
        },
        onError: (error) => {
            displayAlert({ text: error.message, variant: 'error', autoHideDuration: 3000 });
        },
    });

    const isConfirmDisabled = computeIsConfirmDisabled({
        name,
        duration,
        startDateTime,
        endDateTime,
    });
    const isCreating = createExamMutation.isPending;

    return (
        <Modal
            size="large"
            isOpen={props.isOpen}
            close={props.close}
            onConfirm={saveExam}
            confirmButtonLabel="Créer"
            cancelButtonLabel="Annuler"
            isConfirmDisabled={isConfirmDisabled}
            isConfirmLoading={isCreating}
            title="Création d'un examen"
            subtitle={props.classe.name}
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

                <FieldContainer>
                    <SelectExamExtremums
                        startDateTime={startDateTime}
                        endDateTime={endDateTime}
                        setStartDateTime={setStartDateTime}
                        setEndDateTime={setEndDateTime}
                    />
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
        if (!startDateTime || !endDateTime) {
            return;
        }
        createExamMutation.mutate({
            duration: isThereDuration ? Number(duration) : undefined,
            name,
            classeId: props.classe.id,
            startDateTime,
            endDateTime,
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
});

export { ExamCreationModal };
