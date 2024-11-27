import { styled, Typography } from '@mui/material';

function PaymentFailure() {
    return (
        <Container>
            <ContentContainer>
                <Title variant="h2">Échec du paiement</Title>
                <Typography>
                    Votre paiement a échoué. Vous n'avez pas été débité. Vous pouvez retenter une
                    commande.
                </Typography>
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
export { PaymentFailure };
