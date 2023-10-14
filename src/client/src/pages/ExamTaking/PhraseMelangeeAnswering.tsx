import React, { useState } from 'react';
import { Typography, styled } from '@mui/material';
import { questionType } from './types';

function PhraseMelangeeAnswering(props: {
    question: questionType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    const [combination, setCombination] = useState<number[]>([]);

    const shuffledWords = props.question.title.split(' ');

    return (
        <div>
            <StyledContainer>
                <Typography>
                    <BoldContainer>{props.index}. </BoldContainer>
                </Typography>
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
                    <BoldContainer>Votre réponse :</BoldContainer>{' '}
                    {props.currentAnswer
                        ? props.currentAnswer
                        : '____ '.repeat(shuffledWords.length)}
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
                props.setCurrentAnswer(answer);
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

const BoldContainer = styled('span')({ fontWeight: 'bold' });

export { PhraseMelangeeAnswering };
