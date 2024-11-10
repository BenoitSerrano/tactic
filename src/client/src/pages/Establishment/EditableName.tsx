import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { TextField, Typography, styled } from '@mui/material';
import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../lib/alert';
import { api } from '../../lib/api';
import { IconButton } from '../../components/IconButton';

function EditableName(props: { establishment: { id: string; name: string } }) {
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const updateEstablishmentNameMutation = useMutation({
        mutationFn: api.updateEstablishmentName,
        onSuccess: () => {
            displayAlert({
                variant: 'success',
                text: `L'établissement "${props.establishment.name}" a bien été modifié`,
            });
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ['establishments'] });
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
    const [name, setName] = useState(props.establishment.name);
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        const isConfirmButtonLoading = updateEstablishmentNameMutation.isPending;
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
            <Typography variant="h3">{name}</Typography>
            <IconButton IconComponent={EditIcon} onClick={activateEditing} title="Éditer" />
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
        if (props.establishment.name !== name) {
            updateEstablishmentNameMutation.mutate({
                establishmentId: props.establishment.id,
                name,
            });
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
