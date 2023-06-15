import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { api } from '../lib/api';

function QuestionAnswering(props: { questionChoixMultiple: any; attemptId: string }) {
    const upsertQcmAnswerMutation = useMutation({
        mutationFn: api.createOrUpdateQcmAnswer,
    });
    const qcmId = props.questionChoixMultiple.id;

    const [choice, setChoice] = useState<number>();

    return (
        <p key={qcmId}>
            <h2>
                {props.questionChoixMultiple.order}. {props.questionChoixMultiple.title}
            </h2>
            {props.questionChoixMultiple.possibleAnswers.map(
                (possibleAnswer: any, index: number) => (
                    <React.Fragment>
                        <input
                            type="radio"
                            id={`${qcmId}-${index}`}
                            name={props.questionChoixMultiple.id}
                            value={possibleAnswer}
                            checked={choice === index}
                            onChange={() => onChooseQcmAnswer(index)}
                        />
                        <label htmlFor={`${qcmId}-${index}`}>{possibleAnswer}</label>
                    </React.Fragment>
                ),
            )}
        </p>
    );

    function onChooseQcmAnswer(newChoice: number) {
        setChoice(newChoice);
        upsertQcmAnswerMutation.mutate({
            attemptId: props.attemptId,
            qcmId: props.questionChoixMultiple.id,
            choice: newChoice,
        });
    }
}

export { QuestionAnswering };
