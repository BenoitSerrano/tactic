import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField, Typography, styled } from '@mui/material';
import { FormEvent, useState } from 'react';
import { examApiType } from '../../../pages/Classe/types';
import { useAlert } from '../../../lib/alert';
import { IconButton } from '../../IconButton';
import { examsApi } from '../../../lib/api/examsApi';

function EditableName(props: { exam: examApiType; examsQueryKey: string[] }) {
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const updateExamNameMutation = useMutation({
        mutationFn: examsApi.updateExamName,
        onSuccess: (exam) => {
            displayAlert({
                variant: 'success',
                text: `L'examen "${exam.name}" a bien été modifié`,
            });
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: props.examsQueryKey });
        },
        onError: (error) => {
            setIsEditing(false);
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Les modifications n'ont pas pu être enregistrées.",
            });
        },
    });
    const [name, setName] = useState(props.exam.name);
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        const isConfirmButtonLoading = updateExamNameMutation.isPending;
        const isConfirmButtonDisabled = name === '';
        return (
            <Container onSubmit={handleSubmitText}>
                <TextField
                    onClick={onTextInputClick}
                    autoFocus
                    variant="standard"
                    value={name}
                    fullWidth
                    onChange={onChange}
                />
                <IconButton
                    onClick={onValidateChanges}
                    IconComponent={CheckIcon}
                    title="Valider"
                    disabled={isConfirmButtonDisabled}
                    isLoading={isConfirmButtonLoading}
                />
            </Container>
        );
    }
    return (
        <Container>
            <Typography variant="h4">{name}</Typography>
            <IconButton
                IconComponent={EditIcon}
                onClick={activateEditing}
                title="Éditer le nom de l'examen"
            />
        </Container>
    );

    function onTextInputClick(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();
    }

    function handleSubmitText(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        confirmChanges();
    }

    function confirmChanges() {
        if (props.exam.name !== name) {
            updateExamNameMutation.mutate({ examId: props.exam.id, name });
        } else {
            setIsEditing(false);
        }
    }

    function onValidateChanges(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();

        confirmChanges();
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }

    function activateEditing(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();

        setIsEditing(true);
    }
}

const Container = styled('form')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

export { EditableName };
