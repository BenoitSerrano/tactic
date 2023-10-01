import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { ChangeEvent, useState } from 'react';
import { api } from '../../lib/api';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useTimeoutAlert } from './useTimeoutAlert';
import { questionChoixMultipleType } from './types';

function QuestionChoixMultipleAnswering(props: {
    questionChoixMultiple: questionChoixMultipleType;
    index: number;
    attemptId: string;
}) {
    const { displayTimeoutAlert } = useTimeoutAlert();
    const queryClient = useQueryClient();

    const upsertQcmAnswerMutation = useMutation({
        mutationFn: api.createOrUpdateQcmAnswer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attempts-without-answers'] });
        },
        onError: async (error) => {
            console.warn(error);
            displayTimeoutAlert();
        },
    });

    const [choice, setChoice] = useState<number>(props.questionChoixMultiple.choice);

    return (
        <div>
            <FormControl>
                <FormLabel>
                    {props.index + 1}. {props.questionChoixMultiple.title}
                </FormLabel>
                <RadioGroup value={choice} onChange={onChooseQcmAnswer}>
                    {props.questionChoixMultiple.possibleAnswers.map(
                        (possibleAnswer: any, index: number) => (
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
        setChoice(newChoice);
        upsertQcmAnswerMutation.mutate({
            attemptId: props.attemptId,
            qcmId: `${props.questionChoixMultiple.id}`,
            choice: newChoice,
        });
    }
}

export { QuestionChoixMultipleAnswering };
