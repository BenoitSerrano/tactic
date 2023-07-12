import { useMutation } from '@tanstack/react-query';
import React, { ChangeEvent, useState } from 'react';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

function QuestionChoixMultipleAnswering(props: {
    questionChoixMultiple: {
        id: number;
        title: string;
        possibleAnswers: string[];
        choice: number;
    };
    index: number;
    attemptId: string;
}) {
    const navigate = useNavigate();
    const upsertQcmAnswerMutation = useMutation({
        mutationFn: api.createOrUpdateQcmAnswer,
        onError: async (error) => {
            console.warn(error);
            navigate('/student/attempt-timeout');
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
