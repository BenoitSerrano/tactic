import { styled, Typography } from '@mui/material';

function PaymentConfirmed() {
    return (
        <Container>
            <ContentContainer>
                <Title variant="h2">Commande terminée !</Title>
                <Typography>
                    Votre commande a bien été effectuée. Votre compte a été crédité du nombre de
                    copies correspondant.
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
export { PaymentConfirmed };
