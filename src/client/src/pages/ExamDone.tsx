import { Typography, styled } from '@mui/material';
import { NotLoggedInPage } from '../components/NotLoggedInPage';

function ExamDone() {
    return (
        <NotLoggedInPage>
            <MainContainer>
                <TextContainer>
                    <Typography variant="h4">
                        Réponses enregistrées, merci. Vous pouvez quitter la page.
                    </Typography>
                </TextContainer>
            </MainContainer>
        </NotLoggedInPage>
    );
}

const MainContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
});

const TextContainer = styled('div')({
    textAlign: 'center',
});

export { ExamDone };
