import { Typography, styled } from '@mui/material';
import { NotLoggedInPage } from '../../components/NotLoggedInPage';
import Markdown from 'react-markdown';
import { examDoneText } from './constants';

function ExamDone() {
    return (
        <NotLoggedInPage>
            <MainContainer>
                <TextContainer>
                    <Typography variant="h5">
                        <Markdown>{examDoneText}</Markdown>
                    </Typography>
                    {/* <Typography variant="h4">
                        Réponses enregistrées, merci. Vous pouvez quitter la page.
                    </Typography> */}
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
    width: '50%',
});

export { ExamDone };
