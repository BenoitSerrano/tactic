import { styled } from '@mui/material';
import { acceptableAnswerType } from '../../../../types';
import { IsolatedWord, IsolatedWordContainer } from '../../components/IsolatedWord';
import { computeTexteATrousState } from '../lib/computeTexteATrousState';

function WordsBlanker(props: {
    title: string;
    setTitle: (title: string) => void;
    acceptableAnswers: acceptableAnswerType[][];
    setAcceptableAnswers: (acceptableAnswers: acceptableAnswerType[][]) => void;
    pointsPerBlank: number;
    setPoints: (points: number) => void;
}) {
    const words = props.title.split(' ');
    return (
        <Container>
            {words.map((word, wordIndex) => (
                <IsolatedWordContainer key={`word-${wordIndex}`}>
                    <IsolatedWord onClick={buildOnClickOnWord(wordIndex)} word={word} />
                </IsolatedWordContainer>
            ))}
        </Container>
    );

    function buildOnClickOnWord(wordIndex: number) {
        return () => {
            const nextState = computeTexteATrousState(wordIndex, {
                title: props.title,
                rightAnswers: props.acceptableAnswers.map(
                    (acceptableAnswersPerBlank) => acceptableAnswersPerBlank[0].answer,
                ),
            });
            props.setTitle(nextState.title);
            props.setAcceptableAnswers(
                nextState.rightAnswers.map((answer) => [
                    {
                        answer,
                        grade: 'A',
                    },
                ]),
            );
            props.setPoints(props.pointsPerBlank * nextState.rightAnswers.length);
        };
    }
}

const Container = styled('div')({ display: 'flex', flexWrap: 'wrap' });

export { WordsBlanker };
