import React, { ChangeEvent } from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, styled } from '@mui/material';
import { questionWithoutAnswerType } from '../types';

function QuestionChoixMultipleAnswering(props: {
    question: questionWithoutAnswerType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    return (
        <FormControl>
            <StyledFormLabel>
                <Title>
                    {props.index}. {props.question.title}
                </Title>
            </StyledFormLabel>
            <RadioGroup value={props.currentAnswer} onChange={onChooseNewAnswer}>
                {props.question.possibleAnswers.map((possibleAnswer, index: number) => (
                    <React.Fragment key={`${props.question.id}-${index}`}>
                        <StyledFormControlLabel
                            value={index}
                            control={<StyledRadio />}
                            label={possibleAnswer}
                        />
                    </React.Fragment>
                ))}
            </RadioGroup>
        </FormControl>
    );

    function onChooseNewAnswer(event: ChangeEvent<HTMLInputElement>) {
        props.setCurrentAnswer(event.target.value);
    }
}

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
    color: theme.palette.common.black,
    '&.MuiFormLabel-root': {
        color: theme.palette.common.black,
    },
}));
const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    color: theme.palette.common.black,
}));

const StyledRadio = styled(Radio)(({ theme }) => ({
    color: theme.palette.common.black,
}));

const Title = styled('span')({ fontWeight: 'bold' });

export { QuestionChoixMultipleAnswering };
