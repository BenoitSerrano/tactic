import React, { ChangeEvent } from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, styled } from '@mui/material';
import { questionType } from './types';

function QuestionChoixMultipleAnswering(props: {
    question: questionType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    return (
        <div>
            <FormControl>
                <FormLabel>
                    <IndexContainer>{props.index}</IndexContainer>. {props.question.title}
                </FormLabel>
                <RadioGroup value={props.currentAnswer} onChange={onChooseNewAnswer}>
                    {props.question.possibleAnswers?.map((possibleAnswer, index: number) => (
                        <React.Fragment key={`${props.question.id}-${index}`}>
                            <FormControlLabel
                                value={index}
                                control={<Radio />}
                                label={possibleAnswer}
                            />
                        </React.Fragment>
                    ))}
                </RadioGroup>
            </FormControl>
        </div>
    );

    function onChooseNewAnswer(event: ChangeEvent<HTMLInputElement>) {
        props.setCurrentAnswer(event.target.value);
    }
}

const IndexContainer = styled('span')({ fontWeight: 'bold' });

export { QuestionChoixMultipleAnswering };
