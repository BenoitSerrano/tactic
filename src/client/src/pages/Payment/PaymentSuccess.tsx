import { styled, Typography } from '@mui/material';
import { Loader } from '../../components/Loader';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { paymentsApi } from '../../lib/api/paymentsApi';
import { useEffect } from 'react';
import { pathHandler } from '../../lib/pathHandler';

function PaymentSuccess() {
    const params = useParams();
    const stripeCheckoutSessionId = params.stripeCheckoutSessionId as string;
    const assertIsPaymentSessionCompletedQuery = useQuery({
        queryFn: () => paymentsApi.assertIsPaymentSessionCompleted(stripeCheckoutSessionId),
        queryKey: ['stripe-checkout-sessions', stripeCheckoutSessionId, 'is-completed'],
    });
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (assertIsPaymentSessionCompletedQuery.data) {
            queryClient.invalidateQueries({ queryKey: ['remaining-papers'] });
            navigate(pathHandler.getRoutePath('PAYMENT_CONFIRMED'));
        }
    }, [assertIsPaymentSessionCompletedQuery.data, navigate, queryClient]);
    return (
        <Container>
            <ContentContainer>
                <Title variant="h2">Paiement réussi</Title>
                <Typography>
                    Votre paiement s'est déroulé avec succès. Veuillez patienter pendant que nous
                    récupérons les données de la commande...
                </Typography>
                <Loader />
            </ContentContainer>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
}));
const ContentContainer = styled('div')(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(5),
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
}));
const Title = styled(Typography)(({ theme }) => ({ marginBottom: theme.spacing(3) }));
export { PaymentSuccess };
