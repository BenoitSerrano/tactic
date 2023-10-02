import React from 'react';
import { TextField, Typography, styled } from '@mui/material';
import { questionTrouType } from './types';

function QuestionTrouAnswering(props: {
    questionTrou: questionTrouType;
    index: number;
    attemptId: string;
    answer: string;
    setAnswer: (answer: string) => void;
}) {
    return (
        <StyledContainer>
            <Typography>
                <IndexContainer>{props.index}</IndexContainer>. {props.questionTrou.beforeText}
            </Typography>
            <StyledTextField value={props.answer} onChange={onChangeAnswer} placeholder="..." />
            <Typography>{props.questionTrou.afterText}</Typography>
        </StyledContainer>
    );

    function onChangeAnswer(event: React.ChangeEvent<HTMLInputElement>) {
        props.setAnswer(event.target.value);
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

const StyledTextField = styled(TextField)({
    marginLeft: '5px',
    marginRight: '5px',
});

const IndexContainer = styled('span')({ fontWeight: 'bold' });
export { QuestionTrouAnswering };
