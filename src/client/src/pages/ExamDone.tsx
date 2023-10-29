import { Typography, styled } from '@mui/material';
import { NotLoggedInPage } from '../components/NotLoggedInPage';

function ExamDone() {
    return (
        <NotLoggedInPage>
            <MainContainer>
                <Header>
                    <Typography variant="h4">
                        Réponses enregistrées, merci. Vous pouvez quitter la page.
                    </Typography>
                </Header>
            </MainContainer>
        </NotLoggedInPage>
    );
}

const MainContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '50%',
});

const Header = styled('div')({
    textAlign: 'center',
    marginBottom: '20px',
});

export { ExamDone };
