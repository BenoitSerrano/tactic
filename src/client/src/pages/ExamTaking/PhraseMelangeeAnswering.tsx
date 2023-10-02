import React, { useState } from 'react';
import { Typography, styled } from '@mui/material';
import { phraseMelangeeType } from './types';

function PhraseMelangeeAnswering(props: {
    phraseMelangee: phraseMelangeeType;
    index: number;
    attemptId: string;
    answer: string;
    setAnswer: (answer: string) => void;
}) {
    const [combination, setCombination] = useState<number[]>([]);

    const shuffledWords = props.phraseMelangee.shuffledPhrase.split(' ');

    return (
        <div>
            <StyledContainer>
                <Typography>{props.index}. </Typography>
                {shuffledWords.map((word, index) =>
                    combination.includes(index) ? undefined : (
                        <ShuffledWordContainer
                            key={index}
                            onClick={buildOnClickOnShuffledWord(index)}
                        >
                            <Typography>{word}</Typography>
                        </ShuffledWordContainer>
                    ),
                )}
            </StyledContainer>
            <StyledContainer>
                {combination.map((combinationIndex, index) => (
                    <ShuffledWordContainer
                        key={index}
                        onClick={buildOnClickOnReconstitutedWord(index)}
                    >
                        <Typography>{shuffledWords[combinationIndex]}</Typography>
                    </ShuffledWordContainer>
                ))}
            </StyledContainer>
            {
                <Typography>
                    Votre réponse :{' '}
                    {props.answer ? props.answer : '____ '.repeat(shuffledWords.length)}
                </Typography>
            }
        </div>
    );

    function buildOnClickOnShuffledWord(index: number) {
        return () => {
            const newCombination = [...combination, index];
            setCombination(newCombination);

            if (newCombination.length === shuffledWords.length) {
                const answer = newCombination.map((index) => shuffledWords[index]).join(' ');
                props.setAnswer(answer);
            }
        };
    }

    function buildOnClickOnReconstitutedWord(index: number) {
        return () => {
            const newCombination = [...combination];
            newCombination.splice(index, 1);
            setCombination(newCombination);
        };
    }
}

const StyledContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '10px',
});

const ShuffledWordContainer = styled('div')({
    borderWidth: '2px',
    borderStyle: 'dotted',
    padding: '4px',
    marginLeft: '4px',
    marginRight: '4px',
    cursor: 'pointer',
});

export { PhraseMelangeeAnswering };
