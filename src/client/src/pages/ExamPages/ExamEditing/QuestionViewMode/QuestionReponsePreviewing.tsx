import { Typography, styled } from '@mui/material';
import { acceptableAnswerType } from '../../../../types';
import { AcceptableAnswersPreviewing } from './AcceptableAnswersPreviewing';

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

            <AcceptableAnswersPreviewing acceptableAnswers={props.acceptableAnswers} />
        </Container>
    );
}

const Container = styled('div')({});
const TitleContainer = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
}));

export { QuestionReponsePreviewing };
