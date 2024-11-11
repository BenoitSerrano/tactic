import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField } from '@mui/material';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { Modal } from '../../components/Modal';

function ClasseCreationModal(props: {
    close: () => void;
    isOpen: boolean;
    establishmentId: string;
}) {
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();
    const [name, setName] = useState('');

    const createClasseMutation = useMutation({
        mutationFn: api.createClasse,
        onSuccess: () => {
            setName('');
            queryClient.invalidateQueries({ queryKey: ['establishments'] });
            displayAlert({
                text: `La classe "${name}" a bien été créée`,
                variant: 'success',
            });
            props.close();
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. La classe n'a pas pu être créée.",
            });
        },
    });
    return (
        <Modal
            size="small"
            onConfirm={createClasse}
            isOpen={props.isOpen}
            title="Ajouter une classe"
            close={props.close}
            confirmButtonLabel="Ajouter"
        >
            <TextField
                autoFocus
                label="Nom de la classe"
                fullWidth
                name="classe-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
        </Modal>
    );

    async function createClasse() {
        createClasseMutation.mutate({ name, establishmentId: props.establishmentId });
    }
}

export { ClasseCreationModal };
