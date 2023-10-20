import React from 'react';
import { Modal } from '../../components/Modal';
import { Typography } from '@mui/material';

function ExamCreatedModal(props: { isOpen: boolean; close: () => void }) {
    return (
        <Modal
            isOpen={props.isOpen}
            close={props.close}
            cancelButtonLabel="Fermer"
            onConfirm={props.close}
            confirmButtonLabel="J'ai compris !"
            title="Votre test a été créé !"
        >
            <Typography>
                Vous pouvez maintenant l'éditer, copier le lien à partager à vos élèves et accéder
                aux résultats depuis cette page.
            </Typography>
        </Modal>
    );
}

export { ExamCreatedModal };
