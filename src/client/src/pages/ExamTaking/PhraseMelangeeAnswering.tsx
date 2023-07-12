import React, { useState } from 'react';
import { Typography, styled } from '@mui/material';
import { phraseMelangeeModule } from '../../modules/phraseMelangee';

function PhraseMelangeeAnswering(props: {
    phraseMelangee: {
        id: number;
        words: string[];
        shuffledCombination: number[];
    };
    index: number;
    attemptId: string;
}) {
    const [combination, setCombination] = useState<number[]>([]);

    const shuffledWords = phraseMelangeeModule.computeShuffledWords(
        props.phraseMelangee.words,
        props.phraseMelangee.shuffledCombination,
    );
    const reconstitutedWords = phraseMelangeeModule.computeShuffledWords(
        shuffledWords,
        combination,
    );

    return (
        <div>
            <StyledContainer>
                <Typography>{props.index + 1}. </Typography>
                {shuffledWords.map((shuffledWord, index) =>
                    combination.includes(index) ? undefined : (
                        <ShuffledWordContainer
                            key={index}
                            onClick={buildOnClickOnShuffledWord(index)}
                        >
                            <Typography>{shuffledWord}</Typography>
                        </ShuffledWordContainer>
                    ),
                )}
            </StyledContainer>
            <StyledContainer>
                {reconstitutedWords.map((reconstitutedWord, index) => (
                    <ReconstitudedWordContainer
                        key={index}
                        onClick={buildOnClickOnReconstitutedWord(index)}
                    >
                        <Typography>{reconstitutedWord}</Typography>
                    </ReconstitudedWordContainer>
                ))}
            </StyledContainer>
        </div>
    );

    function buildOnClickOnShuffledWord(index: number) {
        return () => {
            setCombination([...combination, index]);
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
});

const ReconstitudedWordContainer = styled('div')({
    borderWidth: '2px',
    borderStyle: 'dotted',
    borderColor: 'green',
    padding: '4px',
    marginLeft: '4px',
    marginRight: '4px',
});

export { PhraseMelangeeAnswering };
