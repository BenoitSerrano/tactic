import { Typography, styled } from '@mui/material';
import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { Card } from '../components/Card';

function ResetPasswordSuccess() {
    return (
        <NotLoggedInPage>
            <ContentContainer>
                <Card width="40%">
                    <TitleContainer>
                        <Typography variant="h2">Mot de passe réinitialisé !</Typography>
                    </TitleContainer>
                    <TextContainer>
                        <Typography>
                            Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
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

export { ResetPasswordSuccess };
