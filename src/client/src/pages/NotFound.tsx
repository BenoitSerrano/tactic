import { Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { Button } from '../components/Button';
import { config } from '../config';
import { pathHandler } from '../lib/pathHandler';

function NotFound() {
    const navigate = useNavigate();
    const homePath = pathHandler.getRoutePath('HOME');
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
                            <Button variant="outlined" onClick={() => navigate(homePath)}>
                                Retour à l'accueil
                            </Button>
                        </div>
                    </ContentContainer>
                    <ContentContainer>
                        <img src={`${config.API_URL}/static/images/404.svg`} alt="" />
                    </ContentContainer>
                </CenteredContainer>
            </MainContainer>
        </NotLoggedInPage>
    );
}

const MainContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    padding: theme.spacing(2),
    width: '100%',
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
    justifyContent: 'center',
    flexDirection: 'column',
    width: '40%',
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
}));

const TitleContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(6) }));
const TextContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(3) }));

export { NotFound };
