import { TextField } from '@mui/material';
import { Modal } from '../Modal';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../lib/alert';
import { establishmentsApi } from '../../lib/api/establishmentsApi';

function EstablishmentCreationModal(props: { isOpen: boolean; close: () => void }) {
    const [name, setName] = useState('');
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const createEstablishmentMutation = useMutation({
        mutationFn: establishmentsApi.createEstablishment,
        onSuccess: () => {
            setName('');
            queryClient.invalidateQueries({ queryKey: ['establishments', 'with-classes'] });
            displayAlert({
                text: `L'établissement "${name}" a bien été créé`,
                variant: 'success',
            });
            props.close();
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. L'établissement n'a pas pu être créé.",
            });
        },
    });
    const canConfirm = !!name;
    return (
        <Modal
            size="small"
            title="Ajouter un établissement"
            close={props.close}
            isOpen={props.isOpen}
            onConfirm={onConfirm}
            isConfirmDisabled={!canConfirm}
        >
            <TextField
                autoFocus
                onChange={onChange}
                value={name}
                fullWidth
                label="Nom de l'établissement"
            />
        </Modal>
    );

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }

    function onConfirm() {
        createEstablishmentMutation.mutate({ name });
    }
}

export { EstablishmentCreationModal };
