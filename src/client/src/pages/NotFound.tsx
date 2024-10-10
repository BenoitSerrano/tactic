import { Typography, styled } from '@mui/material';
import { Animation } from '../components/Animation';
import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { Button } from '../components/Button';

function NotFound() {
    return (
        <NotLoggedInPage>
            <MainContainer>
                <CenteredContainer>
                    <ContentContainer>
                        <TitleContainer>
                            <Typography variant="h1">Damned...</Typography>
                        </TitleContainer>
                        <TextContainer>
                            <Typography variant="h4">
                                Il semble que la page que vous recherchez n'existe pas. Cliquez sur
                                le bouton ci-dessous pour revenir à la page d'accueil.
                            </Typography>
                        </TextContainer>
                        <div>
                            <Button variant="outlined">Retour</Button>
                        </div>
                    </ContentContainer>
                    <ContentContainer>
                        <Animation name="404" />
                    </ContentContainer>
                </CenteredContainer>
            </MainContainer>
        </NotLoggedInPage>
    );
}

const MainContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    padding: theme.spacing(2),
}));
const CenteredContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    textAlign: 'right',

    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
}));

const ContentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
}));

const TitleContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(6) }));
const TextContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(3) }));

export { NotFound };
