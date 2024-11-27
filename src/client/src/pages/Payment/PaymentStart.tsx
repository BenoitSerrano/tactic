import { styled, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Modal } from '../../components/Modal';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { packagesApi } from '../../lib/api/packagesApi';
import { Loader } from '../../components/Loader';
import { pathHandler } from '../../lib/pathHandler';

function PaymentStart() {
    const params = useParams();
    const packageId = params.packageId as string;
    const [isModalOpen, setIsModalOpen] = useState(true);
    const packageQuery = useQuery({
        queryKey: ['packages', packageId],
        queryFn: () => packagesApi.getPackage(packageId),
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (packageQuery.data) {
            setIsModalOpen(true);
        }
    }, [packageQuery.data]);
    return (
        <Container>
            {packageQuery.isLoading && <Loader />}
            <Modal
                isOpen={isModalOpen}
                close={closeModal}
                title="Confirmation de paiement"
                onConfirm={onConfirmPaymentStart}
                confirmButtonLabel="Commencer le paiement"
            >
                {packageQuery.data ? (
                    <>
                        <Typography variant="h4">
                            Vous êtes sur le point d'acheter le lot suivant :
                        </Typography>
                        <ul>
                            <li>
                                <Typography>
                                    {packageQuery.data.paperCount} copies corrigées
                                </Typography>
                            </li>
                            <li>
                                <Typography>{packageQuery.data.price.toFixed(2)} €</Typography>
                            </li>
                        </ul>
                    </>
                ) : (
                    <div />
                )}
            </Modal>
        </Container>
    );

    function onConfirmPaymentStart() {}

    function closeModal() {
        navigate(pathHandler.getRoutePath('TEACHER_HOME'));

        setIsModalOpen(false);
    }
}

const Container = styled('div')({});
export { PaymentStart };
