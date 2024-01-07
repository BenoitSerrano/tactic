import { Typography, styled } from '@mui/material';
import { AcceptableAnswersPreviewing } from './AcceptableAnswersPreviewing';
import { acceptableAnswerType } from '../../../../types';
import { ShuffleWord } from '../../components/ShuffledWord';

function PhraseMelangeePreviewing(props: {
    index: number;
    title: string;
    acceptableAnswers: acceptableAnswerType[][];
}) {
    return (
        <Container>
            <TitleContainer>
                {props.index}.{' '}
                {props.title.split(' ').map((word, index) => (
                    <ShuffleWord key={`shuffled-word-${index}`} word={word} />
                ))}
            </TitleContainer>
            <AcceptableAnswersPreviewing acceptableAnswers={props.acceptableAnswers} />
        </Container>
    );
}

const Container = styled('div')({});
const TitleContainer = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'baseline',
    fontWeight: 'bold',
}));
export { PhraseMelangeePreviewing };
