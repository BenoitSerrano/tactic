import { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { api } from '../../../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField } from '@mui/material';
import { useAlert } from '../../../lib/alert';

function GroupCreationModal(props: { close: () => void; isOpen: boolean }) {
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();
    const [name, setName] = useState('');

    const createGroupMutation = useMutation({
        mutationFn: api.createGroup,
        onSuccess: () => {
            setName('');
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            displayAlert({
                text: `Le groupe "${name}" a bien été créé`,
                variant: 'success',
            });
            props.close();
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Le groupe n'a pas pu être créé.",
            });
        },
    });
    return (
        <Modal
            size="small"
            onConfirm={createGroup}
            isOpen={props.isOpen}
            title="Créer un groupe"
            close={props.close}
            confirmButtonLabel="Créer"
        >
            <TextField
                autoFocus
                label="Nom du groupe"
                fullWidth
                name="group-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
        </Modal>
    );

    async function createGroup() {
        createGroupMutation.mutate({ name });
    }
}

export { GroupCreationModal };
