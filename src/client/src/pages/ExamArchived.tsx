import { Typography, styled } from '@mui/material';
import { StudentPage } from '../components/StudentPage';

function ExamArchived() {
    return (
        <StudentPage>
            <MainContainer>
                <TextContainer>
                    <Typography variant="h4">
                        Cet examen a été archivé. Vous ne pouvez pas y accéder.
                    </Typography>
                </TextContainer>
            </MainContainer>
        </StudentPage>
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
