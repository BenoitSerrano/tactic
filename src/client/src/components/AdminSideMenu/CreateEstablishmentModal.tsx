import { useState } from 'react';
import { Modal } from '../Modal';
import { TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../../lib/pathHandler';

function CreateEstablishmentModal(props: { close: () => void; isOpen: boolean }) {
    const [name, setName] = useState('');
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const createEstablishmentMutation = useMutation({
        mutationFn: api.createEstablishment,
        onSuccess: (establishment: { id: string; name: string }) => {
            queryClient.invalidateQueries({
                queryKey: ['establishments'],
            });
            navigate(pathHandler.getRoutePath('EXAM_LIST', { establishmentId: establishment.id }));
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
    return (
        <Modal
            size="small"
            onConfirm={onConfirm}
            close={props.close}
            isOpen={props.isOpen}
            title="Ajouter un établissement"
        >
            <TextField
                label="Nom de l'établissement"
                name="establishmentName"
                value={name}
                onChange={onChangeName}
            />
        </Modal>
    );

    function onConfirm() {
        createEstablishmentMutation.mutate(name);
    }

    function onChangeName(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }
}

export { CreateEstablishmentModal };
