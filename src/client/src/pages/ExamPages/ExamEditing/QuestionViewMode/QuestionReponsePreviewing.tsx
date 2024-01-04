import { Typography, styled } from '@mui/material';
import { acceptableAnswerType } from '../../../../types';

function QuestionReponsePreviewing(props: {
    index: number;
    title: string;
    acceptableAnswers: acceptableAnswerType[][];
}) {
    return (
        <Container>
            <TitleContainer>
                {props.index}. {props.title}
            </TitleContainer>
        </Container>
    );
}

const Container = styled('div')({});
const TitleContainer = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    fontWeight: 'bold',
}));

export { QuestionReponsePreviewing };
