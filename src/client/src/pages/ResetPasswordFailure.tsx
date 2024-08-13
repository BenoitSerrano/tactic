import { Typography, styled } from '@mui/material';
import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { Card } from '../components/Card';

function ResetPasswordFailure() {
    return (
        <NotLoggedInPage>
            <ContentContainer>
                <Card size="medium">
                    <TitleContainer>
                        <Typography variant="h2">
                            Échec de réinitialisation du mot de passe
                        </Typography>
                    </TitleContainer>
                    <TextContainer>
                        <Typography>Le lien de réinitialisation a peut-être expiré.</Typography>
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

export { ResetPasswordFailure };
