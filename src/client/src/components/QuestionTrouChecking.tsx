import React from 'react';
import { TextField, Typography, styled } from '@mui/material';
import { colorLib } from '../lib/colors';

function QuestionTrouChecking(props: {
    questionTrou: {
        id: number;
        beforeText: string;
        afterText: string;
        answer: string;
        status: 'right' | 'wrong' | 'acceptable';
    };
    index: number;
    attemptId: string;
}) {
    const color = colorLib.computeTextColor(props.questionTrou.status);
    const StyledText = styled(Typography)({ color });

    return (
        <StyledContainer>
            <StyledText>
                {props.index + 1}. {props.questionTrou.beforeText}
            </StyledText>
            <StyledTextField disabled placeholder="..." value={props.questionTrou.answer} />
            <StyledText>{props.questionTrou.afterText}</StyledText>
        </StyledContainer>
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

const StyledTextField = styled(TextField)({
    marginLeft: '5px',
    marginRight: '5px',
});

export { QuestionTrouChecking };
