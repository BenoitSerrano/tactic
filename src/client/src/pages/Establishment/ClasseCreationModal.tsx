import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField } from '@mui/material';
import { useAlert } from '../../lib/alert';
import { Modal } from '../../components/Modal';
import { classesApi } from '../../lib/api/classesApi';
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../../lib/pathHandler';

function ClasseCreationModal(props: {
    close: () => void;
    isOpen: boolean;
    establishmentId: string;
}) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();
    const [name, setName] = useState('');

    const createClasseMutation = useMutation({
        mutationFn: classesApi.createClasse,
        onSuccess: (classe) => {
            setName('');
            queryClient.invalidateQueries({ queryKey: ['establishments', 'with-classes'] });
            displayAlert({
                text: `La classe "${name}" a bien été créée`,
                variant: 'success',
            });
            props.close();
            navigate(
                pathHandler.getRoutePath('CLASSE', {
                    establishmentId: props.establishmentId,
                    classeId: classe.id,
                }),
            );
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. La classe n'a pas pu être créée.",
            });
        },
    });
    return (
        <Modal
            size="small"
            onConfirm={createClasse}
            isOpen={props.isOpen}
            title="Ajouter une classe"
            close={props.close}
            confirmButtonLabel="Ajouter"
        >
            <TextField
                autoFocus
                label="Nom de la classe"
                fullWidth
                name="classe-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
        </Modal>
    );

    async function createClasse() {
        createClasseMutation.mutate({ name, establishmentId: props.establishmentId });
    }
}

export { ClasseCreationModal };
