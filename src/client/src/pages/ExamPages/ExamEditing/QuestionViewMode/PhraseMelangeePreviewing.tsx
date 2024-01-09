import { Typography, styled } from '@mui/material';
import { AcceptableAnswersPreviewing } from './AcceptableAnswersPreviewing';
import { acceptableAnswerType } from '../../../../types';
import { IsolatedWord, IsolatedWordContainer } from '../../components/IsolatedWord';

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
                    <IsolatedWordContainer key={`shuffled-word-${index}`}>
                        <IsolatedWord word={word} />
                    </IsolatedWordContainer>
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
    marginBottom: theme.spacing(2),
}));
export { PhraseMelangeePreviewing };
