import { Typography, styled } from '@mui/material';
import { AcceptableAnswersPreviewing } from './AcceptableAnswersPreviewing';
import { acceptableAnswerType } from '../../../../types';
import { ShuffledWord, ShuffledWordContainer } from '../../components/ShuffledWord';

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
                    <ShuffledWordContainer key={`shuffled-word-${index}`}>
                        <ShuffledWord word={word} />
                    </ShuffledWordContainer>
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
