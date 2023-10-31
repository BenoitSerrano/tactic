import { Typography, styled } from '@mui/material';
import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { Card } from '../components/Card';

function ResetPasswordRequested() {
    return (
        <NotLoggedInPage>
            <ContentContainer>
                <Card width="40%">
                    <TitleContainer>
                        <Typography variant="h2">Demande envoyée !</Typography>
                    </TitleContainer>
                    <TextContainer>
                        <Typography>
                            Si cette adresse e-mail est associée à un compte Tactic, vous recevrez
                            d'ici quelques minutes un e-mail contenant les instructions à suivre
                            pour réinitialiser votre mot de passe.
                        </Typography>
                    </TextContainer>
                </Card>
            </ContentContainer>
        </NotLoggedInPage>
    );
}

const ContentContainer = styled('div')({
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
});

const TextContainer = styled('div')({});

const TitleContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(6),
    textAlign: 'center',
}));

export { ResetPasswordRequested };
