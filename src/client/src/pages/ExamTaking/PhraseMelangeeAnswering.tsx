import React, { useState } from 'react';
import { IconButton, Tooltip, Typography, styled } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import { questionType } from './types';

function PhraseMelangeeAnswering(props: {
    question: questionType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    const [combination, setCombination] = useState<number[]>([]);

    const shuffledWords = props.question.title.split(' ');
    const isResetButtonDisabled = combination.length === 0;

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

            <CurrentAnswerContainer>
                <Typography>
                    <BoldContainer>Votre réponse :</BoldContainer>{' '}
                    {props.currentAnswer ? (
                        props.currentAnswer
                    ) : (
                        <span>
                            {combination.map((index) => shuffledWords[index]).join(' ')}
                            {' ____'.repeat(shuffledWords.length - combination.length)}
                        </span>
                    )}
                </Typography>
                <Tooltip title="Réinitialiser">
                    <IconButton
                        disabled={isResetButtonDisabled}
                        onClick={() => setCombination([])}
                        color="inherit"
                    >
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </CurrentAnswerContainer>
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
}

const CurrentAnswerContainer = styled('div')({ display: 'flex' });

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
