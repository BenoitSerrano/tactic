import React from 'react';
import { Typography, styled } from '@mui/material';
import { phraseMelangeeModule } from '../../modules/phraseMelangee';
import { colorLib } from '../../lib/colors';

function PhraseMelangeeChecking(props: {
    phraseMelangee: {
        id: number;
        words: string[];
        shuffledCombination: number[];
        combination: number[];
        status: 'right' | 'wrong';
    };
    index: number;
    attemptId: string;
}) {
    const shuffledWords = phraseMelangeeModule.computeShuffledWords(
        props.phraseMelangee.words,
        props.phraseMelangee.shuffledCombination,
    );
    const reconstitutedWords = phraseMelangeeModule.computeShuffledWords(
        shuffledWords,
        props.phraseMelangee.combination,
    );

    const color = colorLib.computeTextColor(props.phraseMelangee.status);

    const StyledText = styled(Typography)({ color });
    return (
        <div>
            <StyledContainer>
                <Typography>{props.index + 1}. </Typography>
                {reconstitutedWords.map((reconstitutedWord, index) => (
                    <ReconstitudedWordContainer key={index}>
                        <StyledText>{reconstitutedWord}</StyledText>
                    </ReconstitudedWordContainer>
                ))}
            </StyledContainer>
        </div>
    );
}

const StyledContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '10px',
});

const ReconstitudedWordContainer = styled('div')({
    borderWidth: '2px',
    borderStyle: 'dotted',
    borderColor: 'green',
    padding: '4px',
    marginLeft: '4px',
    marginRight: '4px',
});

export { PhraseMelangeeChecking };
