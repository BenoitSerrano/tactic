import { styled, Typography } from '@mui/material';

function PaymentSuccess() {
    return (
        <Container>
            <ContentContainer>
                <Title variant="h2">Paiement réussi</Title>
                <Typography>
                    Votre paiement s'est déroulé avec succès. Veuillez patienter pendant que nous
                    récupérons les données de la commande...
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
export { PaymentSuccess };
