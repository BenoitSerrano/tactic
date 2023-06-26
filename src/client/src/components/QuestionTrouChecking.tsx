import React from 'react';
import { TextField, Typography, styled } from '@mui/material';

function QuestionTrouChecking(props: {
    questionTrou: {
        id: number;
        beforeText: string;
        afterText: string;
        answer: string;
    };
    index: number;
    attemptId: string;
}) {
    return (
        <StyledContainer>
            <Typography>
                {props.index + 1}. {props.questionTrou.beforeText}
            </Typography>
            <TextField disabled label="..." value={props.questionTrou.answer} />
            <Typography>{props.questionTrou.afterText}</Typography>
        </StyledContainer>
    );
}

const StyledContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: '5px',
    marginBottom: '5px',
});
export { QuestionTrouChecking };
