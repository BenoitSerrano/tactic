import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField } from '@mui/material';
import { useAlert } from '../../lib/alert';

function StudentsCreationModal(props: { close: () => void; isOpen: boolean }) {
    const [emailList, setEmailList] = useState('');
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();

    const createStudentsMutation = useMutation({
        mutationFn: api.createStudents,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            displayAlert({ text: `Les étudiant.es ont bien été importé.es`, variant: 'success' });
            props.close();
        },
    });
    return (
        <Modal
            onConfirm={importStudentEmails}
            isOpen={props.isOpen}
            title="Importer une liste d'étudiant.es"
            close={props.close}
        >
            <TextField
                multiline
                value={emailList}
                onChange={(event) => setEmailList(event.target.value)}
            />
        </Modal>
    );

    async function importStudentEmails() {
        const emails: string[] = emailList
            .split('\n')
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean);
        createStudentsMutation.mutate(emails);
    }
}

export { StudentsCreationModal };
