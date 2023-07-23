import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField } from '@mui/material';
import { useAlert } from '../../lib/alert';

function StudentCreationModal(props: { close: () => void; isOpen: boolean }) {
    const [email, setEmail] = useState('');
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();

    const createStudentMutation = useMutation({
        mutationFn: api.createStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            displayAlert({ text: "L'étudiant.e a bien été importé", variant: 'success' });
            props.close();
        },
    });

    return (
        <Modal
            isOpen={props.isOpen}
            title="Importer un.e étudiant.e"
            close={props.close}
            onConfirm={createStudent}
        >
            <TextField value={email} onChange={(event) => setEmail(event.target.value)} />
        </Modal>
    );

    async function createStudent() {
        createStudentMutation.mutate(email.trim().toLowerCase());
    }
}

export { StudentCreationModal };
