import React from 'react';
import { Typography, styled } from '@mui/material';
import { colorLib } from '../../lib/colors';

function PhraseMelangeeChecking(props: {
    phraseMelangee: {
        id: number;
        words: string[];
        shuffledCombination: number[];
        reconstitutedPhrase: string | undefined;
        combination: number[] | undefined;
        status: 'right' | 'wrong' | undefined;
    };
    index: number;
    attemptId: string;
}) {
    const color = colorLib.computeTextColor(props.phraseMelangee.status || 'wrong');

    const StyledText = styled(Typography)({ color });
    return (
        <div>
            <StyledContainer>
                <StyledText>
                    {props.index + 1}. {props.phraseMelangee.reconstitutedPhrase}
                </StyledText>
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

export { PhraseMelangeeChecking };
