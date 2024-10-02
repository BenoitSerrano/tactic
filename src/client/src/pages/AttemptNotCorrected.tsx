import { Typography, styled } from '@mui/material';
import { StudentPage } from '../components/StudentPage';

function AttemptNotCorrected() {
    return (
        <StudentPage>
            <MainContainer>
                <TextContainer>
                    <Typography variant="h4">
                        Cette copie n'a pas encore été corrigée. Vous ne pouvez pas y accéder.
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

export { AttemptNotCorrected };
