import React from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, styled } from '@mui/material';
import { acceptableAnswerType } from '../../../../types';

function QcmPreviewing(props: {
    index: number;
    title: string;
    possibleAnswers: string[];
    acceptableAnswers: acceptableAnswerType[][];
}) {
    const rightAnswer: string | undefined = props.acceptableAnswers.length
        ? props.acceptableAnswers[0][0].answer
        : undefined;
    return (
        <FormControl>
            <StyledFormLabel>
                <Title>
                    {props.index}. {props.title}
                </Title>
            </StyledFormLabel>
            <RadioGroup value={rightAnswer}>
                {props.possibleAnswers.map((possibleAnswer, index: number) => {
                    const isRightAnswer =
                        rightAnswer !== undefined && Number(rightAnswer) === index;
                    const FormControlLabelComponent = isRightAnswer
                        ? StyledCorrectFormLabel
                        : StyledIncorrectFormLabel;
                    const RadioComponent = isRightAnswer
                        ? StyledCorrectRadio
                        : StyledIncorrectRadio;
                    return (
                        <React.Fragment key={`${possibleAnswer}-${index}`}>
                            <FormControlLabelComponent
                                value={index}
                                control={<RadioComponent disabled />}
                                label={possibleAnswer}
                            />
                        </React.Fragment>
                    );
                })}
            </RadioGroup>
        </FormControl>
    );
}

const StyledCorrectFormLabel = styled(FormControlLabel)(({ theme }) => ({
    '.MuiFormControlLabel-label.Mui-disabled': {
        color: theme.palette.success.main,
    },
}));

const StyledIncorrectFormLabel = styled(FormControlLabel)(({ theme }) => ({
    color: theme.palette.error.main,
}));

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({ color: theme.palette.common.black }));

const StyledCorrectRadio = styled(Radio)(({ theme }) => ({
    '&.Mui-checked': {
        color: theme.palette.success.main,
    },
}));

const StyledIncorrectRadio = styled(Radio)(({ theme }) => ({
    color: theme.palette.error.main,
}));

const Title = styled('span')({ fontWeight: 'bold' });

export { QcmPreviewing };
