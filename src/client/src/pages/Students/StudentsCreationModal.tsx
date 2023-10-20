import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField, Typography } from '@mui/material';
import { useAlert } from '../../lib/alert';
import { extractEmailsFromEmailList } from './utils';

function StudentsCreationModal(props: { close: () => void; isOpen: boolean }) {
    const [emailList, setEmailList] = useState('');
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();
    const emails = extractEmailsFromEmailList(emailList);

    const createStudentsMutation = useMutation({
        mutationFn: api.createStudents,
        onSuccess: () => {
            setEmailList('');
            queryClient.invalidateQueries({ queryKey: ['students'] });
            displayAlert({
                text: `Les ${emails.length} élèves ont bien été importés`,
                variant: 'success',
            });
            props.close();
        },
    });
    return (
        <Modal
            onConfirm={importStudentEmails}
            isOpen={props.isOpen}
            title="Ajouter des élèves"
            close={props.close}
            confirmButtonLabel="Ajouter"
        >
            <Typography>
                Vous pouvez ajouter plusieurs adresses e-mail dans le champ ci-dessous, en les
                séparant par des espaces.
            </Typography>
            <TextField
                label="Adresses e-mail"
                fullWidth
                multiline
                value={emailList}
                onChange={(event) => setEmailList(event.target.value)}
            />
        </Modal>
    );

    async function importStudentEmails() {
        createStudentsMutation.mutate(emails);
    }
}

export { StudentsCreationModal };
