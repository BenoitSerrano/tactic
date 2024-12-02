import { Typography } from '@mui/material';
import { Modal } from '../../../components/Modal';
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../../../lib/pathHandler';

function ModalNotEnoughPaper(props: { isAttemptTreated: boolean }) {
    const navigate = useNavigate();
    return (
        <Modal
            size="small"
            onConfirm={navigateToPricing}
            close={goBack}
            isOpen={!props.isAttemptTreated}
            title="Plus de copies restantes"
            confirmButtonLabel="Choisir la taille du lot"
        >
            <Typography>
                Il semblerait que vous n'ayez plus de copie sur votre compte... Souhaitez-vous
                acheter un nouveau lot ?
            </Typography>
        </Modal>
    );

    function goBack() {
        navigate(-1);
    }

    function navigateToPricing() {
        navigate(pathHandler.getRoutePath('PRICING'));
    }
}

export { ModalNotEnoughPaper };
