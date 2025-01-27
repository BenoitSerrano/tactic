import { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField, Typography, styled } from '@mui/material';
import { useAlert } from '../../../lib/alert';
import { extractEmailsFromEmailList } from './lib/extractEmailsFromEmailList';
import { studentsApi } from '../../../lib/api/studentsApi';

function StudentsCreationModal(props: { close: () => void; isOpen: boolean; classeId: string }) {
    const [emailList, setEmailList] = useState('');
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();
    const emails = extractEmailsFromEmailList(emailList);

    const createStudentsMutation = useMutation({
        mutationFn: studentsApi.createStudents,
        onSuccess: () => {
            setEmailList('');
            queryClient.invalidateQueries({ queryKey: ['classes', props.classeId, 'students'] });
            displayAlert({
                text: `Les ${emails.length} étudiants ont bien été importés`,
                variant: 'success',
            });
            props.close();
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Les étudiants n'ont pas pu être importés.",
            });
        },
    });
    return (
        <Modal
            onConfirm={importStudentEmails}
            isOpen={props.isOpen}
            title="Ajouter des élèves"
            close={props.close}
            size="small"
            confirmButtonLabel="Ajouter"
        >
            <TextField
                autoFocus
                label="Adresses e-mail"
                minRows={2}
                fullWidth
                multiline
                value={emailList}
                onChange={(event) => setEmailList(event.target.value)}
            />
            <HintContainer>
                <Typography variant="h6">
                    Vous pouvez ajouter plusieurs adresses e-mail dans le champ ci-dessus en les
                    séparant par des espaces, des virgules et/ou des passages à la ligne.
                </Typography>
            </HintContainer>
        </Modal>
    );

    async function importStudentEmails() {
        createStudentsMutation.mutate({ classeId: props.classeId, emails });
    }
}
const HintContainer = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(1),
}));

export { StudentsCreationModal };
