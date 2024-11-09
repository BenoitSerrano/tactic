import { useMutation, useQuery } from '@tanstack/react-query';
import { Modal } from '../../../components/Modal';
import { api } from '../../../lib/api';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { useAlert } from '../../../lib/alert';

function ChangeEstablishmentForClasseModal(props: {
    classeId: string | undefined;
    currentEstablishmentId: string;
    close: () => void;
}) {
    const { displayAlert } = useAlert();
    const query = useQuery({ queryFn: api.fetchEstablishments, queryKey: ['establishments'] });
    const [selectedEstablishmentId, setSelectedEstablishmentId] = useState(
        props.currentEstablishmentId,
    );
    const updateEstablishmentIdMutation = useMutation({
        mutationFn: api.updateEstablishmentId,
        onSuccess: () => {
            props.close();
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. L'établissement n'a pas pu être modifié pour cette classe.",
            });
        },
    });
    if (!query.data) {
        return <div />;
    }
    return (
        <Modal isOpen={!!props.classeId} close={props.close} onConfirm={onConfirm}>
            <Select
                fullWidth
                labelId="select-establishment-label"
                id="select-establishment"
                value={selectedEstablishmentId}
                label="Sélectionner"
                onChange={onSelectEstablishmentId}
            >
                {query.data.map((establishment) => (
                    <MenuItem key={establishment.id} value={establishment.id}>
                        {establishment.name}
                    </MenuItem>
                ))}
            </Select>
        </Modal>
    );

    function onConfirm() {
        if (!props.classeId) {
            return;
        }
        updateEstablishmentIdMutation.mutate({
            classeId: props.classeId,
            establishmentId: selectedEstablishmentId,
        });
    }

    function onSelectEstablishmentId(event: SelectChangeEvent) {
        const newEstablishmentId = event.target.value;
        setSelectedEstablishmentId(newEstablishmentId);
    }
}

export { ChangeEstablishmentForClasseModal };
