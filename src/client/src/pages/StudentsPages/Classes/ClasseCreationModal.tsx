import { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { api } from '../../../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField } from '@mui/material';
import { useAlert } from '../../../lib/alert';

function ClasseCreationModal(props: { close: () => void; isOpen: boolean }) {
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();
    const [name, setName] = useState('');

    const createClasseMutation = useMutation({
        mutationFn: api.createClasse,
        onSuccess: () => {
            setName('');
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            displayAlert({
                text: `La classe "${name}" a bien été créé`,
                variant: 'success',
            });
            props.close();
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. La classe n'a pas pu être créé.",
            });
        },
    });
    return (
        <Modal
            size="small"
            onConfirm={createClasse}
            isOpen={props.isOpen}
            title="Créer une classe"
            close={props.close}
            confirmButtonLabel="Créer"
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
        createClasseMutation.mutate({ name });
    }
}

export { ClasseCreationModal };
