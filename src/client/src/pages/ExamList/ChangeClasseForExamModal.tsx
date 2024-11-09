import { useMutation, useQuery } from '@tanstack/react-query';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { useAlert } from '../../lib/alert';
import { api } from '../../lib/api';
import { Modal } from '../../components/Modal';

function ChangeClasseForExamModal(props: {
    examId: string | undefined;
    establishmentId: string;
    close: () => void;
}) {
    const { displayAlert } = useAlert();
    const query = useQuery({
        queryFn: () => api.fetchClassesByEstablishment(props.establishmentId),
        queryKey: ['establishments', props.establishmentId, 'classes'],
    });
    const [selectedClasseId, setSelectedClasseId] = useState<string | undefined>();
    const updateClasseIdMutation = useMutation({
        mutationFn: api.updateClasseId,
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
        <Modal isOpen={!!props.examId} close={props.close} onConfirm={onConfirm}>
            <Select
                fullWidth
                labelId="select-classe-label"
                id="select-classe"
                value={selectedClasseId}
                label="Sélectionner"
                onChange={onSelectClasseId}
            >
                {query.data.map((classe: any) => (
                    <MenuItem key={classe.id} value={classe.id}>
                        {classe.name}
                    </MenuItem>
                ))}
            </Select>
        </Modal>
    );

    function onConfirm() {
        if (!props.examId || !selectedClasseId) {
            return;
        }
        updateClasseIdMutation.mutate({
            classeId: selectedClasseId,
            examId: props.examId,
        });
    }

    function onSelectClasseId(event: SelectChangeEvent) {
        const newClasseId = event.target.value;
        setSelectedClasseId(newClasseId);
    }
}

export { ChangeClasseForExamModal };
