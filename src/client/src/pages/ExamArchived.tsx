import { Typography, styled } from '@mui/material';
import { NotLoggedInPage } from '../components/NotLoggedInPage';

function ExamArchived() {
    return (
        <NotLoggedInPage>
            <MainContainer>
                <TextContainer>
                    <Typography variant="h4">
                        Cet examen a été archivé. Vous ne pouvez pas y accéder.
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

export { ExamArchived };
