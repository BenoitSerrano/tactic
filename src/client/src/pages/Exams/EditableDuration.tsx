import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import TimerOffOutlinedIcon from '@mui/icons-material/TimerOffOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { TextField, Tooltip, styled } from '@mui/material';
import { FormEvent, useState } from 'react';
import { time } from '../../lib/time';
import { INTEGER_NUMBER_REGEX } from '../../constants';
import { IconButton } from '../../components/IconButton';
import { examApiType } from './types';
import { api } from '../../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../lib/alert';

function EditableDuration(props: { exam: examApiType }) {
    const [value, setValue] = useState<number | null>(props.exam.duration);
    const [isEditing, setIsEditing] = useState(false);
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();

    const updateExamDurationMutation = useMutation({
        mutationFn: api.updateExamDuration,
        onSuccess: (exam) => {
            displayAlert({
                variant: 'success',
                text: `L'examen "${exam.name}" a bien été modifié`,
            });
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Les modifications n'ont pas pu être enregistrées.",
            });
        },
    });

    if (!isEditing) {
        if (props.exam.duration === null) {
            return (
                <NoDurationCellContent>
                    <Tooltip title="Cet examen n'a pas de durée">
                        <TimerOffOutlinedIcon />
                    </Tooltip>
                    <IconButton title="Éditer" IconComponent={EditIcon} onClick={activateEditing} />
                </NoDurationCellContent>
            );
        } else {
            const displayedValue = time.formatToClock(props.exam.duration * 60);

            return (
                <Container>
                    <span>{displayedValue}</span>
                    <IconButton title="Éditer" IconComponent={EditIcon} onClick={activateEditing} />
                </Container>
            );
        }
    }

    const isConfirmDisabled = value === null;

    if (props.exam.duration === null) {
        return (
            <Container onSubmit={handleSubmitDuration}>
                <StyledTextField autoFocus variant="standard" value={value} onChange={onChange} />
                minutes
                <IconButton
                    title="Valider"
                    disabled={isConfirmDisabled}
                    IconComponent={CheckIcon}
                    onClick={confirmChanges}
                />
                <IconButton
                    title="Annuler"
                    IconComponent={CloseOutlinedIcon}
                    onClick={cancelEditing}
                />
            </Container>
        );
    } else {
        return (
            <Container onSubmit={handleSubmitDuration}>
                <StyledTextField autoFocus variant="standard" value={value} onChange={onChange} />
                minutes
                <IconButton
                    title="Valider"
                    disabled={isConfirmDisabled}
                    IconComponent={CheckIcon}
                    onClick={confirmChanges}
                />
                <IconButton
                    title="Enlever la durée"
                    IconComponent={TimerOffOutlinedIcon}
                    onClick={setNullValue}
                />
            </Container>
        );
    }

    function handleSubmitDuration(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (value === null) {
            return;
        }
        confirmChanges();
    }

    function confirmChanges() {
        updateExamDurationMutation.mutate({ examId: props.exam.id, duration: value });
    }

    function setNullValue() {
        setValue(null);
        updateExamDurationMutation.mutate({ examId: props.exam.id, duration: null });
    }

    function cancelEditing() {
        setValue(props.exam.duration);
        setIsEditing(false);
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newDuration = event.target.value;
        if (newDuration.match(INTEGER_NUMBER_REGEX)) {
            setValue(Number(newDuration));
        }
    }

    function activateEditing() {
        setIsEditing(true);
    }
}

const Container = styled('form')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

const StyledTextField = styled(TextField)({ width: 40 });

const NoDurationCellContent = styled('div')({ display: 'flex', alignItems: 'center' });

export { EditableDuration };
