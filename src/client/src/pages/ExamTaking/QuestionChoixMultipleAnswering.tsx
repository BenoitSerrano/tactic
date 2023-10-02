import React, { ChangeEvent } from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { questionChoixMultipleType } from './types';

function QuestionChoixMultipleAnswering(props: {
    questionChoixMultiple: questionChoixMultipleType;
    index: number;
    attemptId: string;
    choice: number;
    setChoice: (choice: number) => void;
}) {
    return (
        <div>
            <FormControl>
                <FormLabel>
                    {props.index}. {props.questionChoixMultiple.title}
                </FormLabel>
                <RadioGroup value={props.choice} onChange={onChooseQcmAnswer}>
                    {props.questionChoixMultiple.possibleAnswers.map(
                        (possibleAnswer, index: number) => (
                            <React.Fragment key={`${props.questionChoixMultiple.id}-${index}`}>
                                <FormControlLabel
                                    value={index}
                                    control={<Radio />}
                                    label={possibleAnswer}
                                />
                            </React.Fragment>
                        ),
                    )}
                </RadioGroup>
            </FormControl>
        </div>
    );

    function onChooseQcmAnswer(event: ChangeEvent<HTMLInputElement>) {
        const newChoice = Number(event.target.value);
        props.setChoice(newChoice);
    }
}

export { QuestionChoixMultipleAnswering };
