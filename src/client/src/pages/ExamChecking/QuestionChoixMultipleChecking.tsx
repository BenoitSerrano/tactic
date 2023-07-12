import React from 'react';
import { colorLib } from '../../lib/colors';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, styled } from '@mui/material';

function QuestionChoixMultipleChecking(props: {
    questionChoixMultiple: {
        id: number;
        title: string;
        possibleAnswers: string[];
        choice: number;
        status: 'right' | 'wrong';
    };
    index: number;
    attemptId: string;
}) {
    const color = colorLib.computeTextColor(props.questionChoixMultiple.status);
    const StyledFormLabel = styled(FormLabel)({ color });

    return (
        <div>
            <FormControl>
                <StyledFormLabel>
                    {props.index + 1}. {props.questionChoixMultiple.title}
                </StyledFormLabel>
                <RadioGroup value={props.questionChoixMultiple.choice}>
                    {props.questionChoixMultiple.possibleAnswers.map(
                        (possibleAnswer: any, index: number) => (
                            <React.Fragment key={`${props.questionChoixMultiple.id}-${index}`}>
                                <FormControlLabel
                                    value={index}
                                    control={<Radio />}
                                    label={possibleAnswer}
                                    disabled
                                />
                            </React.Fragment>
                        ),
                    )}
                </RadioGroup>
            </FormControl>
        </div>
    );
}

export { QuestionChoixMultipleChecking };
