import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Modal } from '../../../components/Modal';
import { groupApiType } from '../types';
import { useState } from 'react';
import { api } from '../../../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../../lib/alert';

function ChangeGroupModal(props: {
    isOpen: boolean;
    close: () => void;
    groups: Array<groupApiType>;
    studentId: string | undefined;
    groupId: string;
}) {
    const [newGroupId, setNewGroupId] = useState<string | undefined>();
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();
    const changeGroupMutation = useMutation({
        mutationFn: api.changeGroup,
        onSuccess: () => {
            setNewGroupId(undefined);
            displayAlert({ text: "L'étudiant a bien été changé de groupe", variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['groups', props.groupId, 'students'] });
            queryClient.invalidateQueries({ queryKey: ['groups', newGroupId, 'students'] });
            props.close();
        },
        onError: () => {
            displayAlert({
                text: "Une erreur est survenue. L'étudiant n'a pas pu être changé de groupe",
                variant: 'error',
            });
        },
    });
    return (
        <Modal
            isOpen={props.isOpen}
            close={props.close}
            title="Changer de groupe"
            onConfirm={changeGroup}
            isConfirmDisabled={!newGroupId}
        >
            <Select
                fullWidth
                labelId="select-group-to-change-label"
                id="select-group-to-change"
                value={newGroupId}
                label="Nouveau groupe"
                onChange={onSelectNewGroup}
            >
                {props.groups.map((group) => (
                    <MenuItem value={group.id}>{group.name}</MenuItem>
                ))}
            </Select>
        </Modal>
    );

    function onSelectNewGroup(event: SelectChangeEvent) {
        setNewGroupId(event.target.value);
    }

    function changeGroup() {
        const { studentId, groupId } = props;
        if (!newGroupId || !studentId) {
            return;
        }
        changeGroupMutation.mutate({ studentId, newGroupId, groupId });
    }
}

export { ChangeGroupModal };
