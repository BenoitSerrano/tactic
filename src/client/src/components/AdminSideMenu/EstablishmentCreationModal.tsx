import { TextField } from '@mui/material';
import { Modal } from '../Modal';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';

function EstablishmentCreationModal(props: { isOpen: boolean; close: () => void }) {
    const [name, setName] = useState('');
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const createClasseMutation = useMutation({
        mutationFn: api.createEstablishment,
        onSuccess: () => {
            setName('');
            queryClient.invalidateQueries({ queryKey: ['establishments'] });
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
            <TextField onChange={onChange} value={name} fullWidth label="Nom de l'établissement" />
        </Modal>
    );

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }

    function onConfirm() {
        createClasseMutation.mutate({ name });
    }
}

export { EstablishmentCreationModal };
