import { useState } from 'react';
import { Modal } from '../Modal';
import { TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../../lib/pathHandler';
import { establishmentUpsertionModalStatusType } from './types';

function UpsertEstablishmentModal(props: {
    close: () => void;
    modalStatus: establishmentUpsertionModalStatusType;
}) {
    const modalParameters = computeModalParameters();
    const [name, setName] = useState(modalParameters.initialName);
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const createEstablishmentMutation = useMutation({
        mutationFn: api.createEstablishment,
        onSuccess: (establishment: { id: string; name: string }) => {
            queryClient.invalidateQueries({
                queryKey: ['establishments'],
            });
            navigate(
                pathHandler.getRoutePath('EXAM_LIST_FOR_ESTABLISHMENT', {
                    establishmentId: establishment.id,
                }),
            );
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
    const updateEstablishmentMutation = useMutation({
        mutationFn: api.updateEstablishment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['establishments'],
            });
            props.close();
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. L'établissement n'a pas pu être modifié.",
            });
        },
    });
    const title = `${modalParameters.titlePrefix} un établissement`;
    return (
        <Modal
            size="small"
            onConfirm={onConfirm}
            close={props.close}
            isOpen={!!props.modalStatus}
            title={title}
        >
            <TextField
                label="Nom de l'établissement"
                name="establishmentName"
                value={name}
                onChange={onChangeName}
            />
        </Modal>
    );

    function computeModalParameters(): { initialName: string; titlePrefix: string } {
        switch (props.modalStatus.kind) {
            case 'creating':
                return { initialName: '', titlePrefix: 'Ajouter' };
            case 'editing':
                return { initialName: props.modalStatus.establishment.name, titlePrefix: 'Éditer' };
        }
    }

    function onConfirm() {
        switch (props.modalStatus.kind) {
            case 'creating':
                return createEstablishmentMutation.mutate({ name });
            case 'editing':
                return updateEstablishmentMutation.mutate({
                    name,
                    establishmentId: props.modalStatus.establishment.id,
                });
        }
    }

    function onChangeName(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }
}

export { UpsertEstablishmentModal };
