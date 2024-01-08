import { useState } from 'react';
import { Typography, styled } from '@mui/material';
import { questionWithoutAnswerType } from '../../types';
import { textSplitter } from '../../../../lib/textSplitter';
import { WordsShuffler } from '../WordsShuffler';
import { computeShuffledAnswerState } from '../../lib/computeShuffledAnswerState';
import { convertAnswerToCombination } from './lib/convertAnswerToCombination';

function PhraseMelangeeAnswering(props: {
    question: questionWithoutAnswerType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    const shuffledWords = textSplitter.split(props.question.title);
    const initialPendingCombination = props.currentAnswer
        ? convertAnswerToCombination(shuffledWords, props.currentAnswer)
        : [];
    const [pendingCombination, setPendingCombination] =
        useState<number[]>(initialPendingCombination);

    const shuffledAnswerState = computeShuffledAnswerState(shuffledWords, pendingCombination);
    return (
        <Container>
            <Title>
                {props.index}. {props.question.title}
            </Title>
            <WordsShuffler
                reset={resetPendingCombination}
                initialWords={shuffledWords}
                shuffledAnswerState={shuffledAnswerState}
                placeWord={buildPlaceWord()}
            />
        </Container>
    );

    function resetPendingCombination() {
        setPendingCombination([]);
    }

    function buildPlaceWord() {
        return (wordIndex: number) => {
            const newPendingCombination = [...pendingCombination, wordIndex];
            setPendingCombination(newPendingCombination);

            if (newPendingCombination.length === shuffledWords.length) {
                const answer = newPendingCombination
                    .map((wordIndex) => shuffledWords[wordIndex])
                    .join(' ');
                props.setCurrentAnswer(answer);
            } else {
            }
        };
    }
}

const Title = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
}));

const Container = styled('div')({ display: 'flex', flexDirection: 'column' });

export { PhraseMelangeeAnswering };
