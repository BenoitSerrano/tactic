import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Modal } from '../../../components/Modal';
import { classeApiType } from '../types';
import { useState } from 'react';
import { api } from '../../../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../../lib/alert';

function ChangeClasseModal(props: {
    isOpen: boolean;
    close: () => void;
    classes: Array<classeApiType>;
    studentId: string | undefined;
    classeId: string;
}) {
    const [newClasseId, setNewClasseId] = useState<string | undefined>();
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();
    const changeClasseMutation = useMutation({
        mutationFn: api.changeClasse,
        onSuccess: () => {
            setNewClasseId(undefined);
            displayAlert({ text: "L'étudiant a bien été changé de classe", variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['classes', props.classeId, 'students'] });
            queryClient.invalidateQueries({ queryKey: ['classes', newClasseId, 'students'] });
            props.close();
        },
        onError: () => {
            displayAlert({
                text: "Une erreur est survenue. L'étudiant n'a pas pu être changé de classe",
                variant: 'error',
            });
        },
    });
    return (
        <Modal
            isOpen={props.isOpen}
            close={props.close}
            title="Changer de classe"
            onConfirm={changeClasse}
            isConfirmDisabled={!newClasseId}
        >
            <Select
                fullWidth
                labelId="select-classe-to-change-label"
                id="select-classe-to-change"
                value={newClasseId}
                label="Nouvelle classe"
                onChange={onSelectNewClasse}
            >
                {props.classes.map((classe) => (
                    <MenuItem value={classe.id}>{classe.name}</MenuItem>
                ))}
            </Select>
        </Modal>
    );

    function onSelectNewClasse(event: SelectChangeEvent) {
        setNewClasseId(event.target.value);
    }

    function changeClasse() {
        const { studentId, classeId } = props;
        if (!newClasseId || !studentId) {
            return;
        }
        changeClasseMutation.mutate({ studentId, newClasseId, classeId });
    }
}

export { ChangeClasseModal };
