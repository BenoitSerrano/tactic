import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

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
    const qcmId = props.questionChoixMultiple.id;

    const [choice, setChoice] = useState<number>(props.questionChoixMultiple.choice);

    return (
        <div key={qcmId}>
            <h2>
                {props.index + 1}. {props.questionChoixMultiple.title}
            </h2>
            {props.questionChoixMultiple.possibleAnswers.map(
                (possibleAnswer: any, index: number) => (
                    <React.Fragment key={`${props.questionChoixMultiple.id}-${index}`}>
                        <input
                            type="radio"
                            id={`${qcmId}-${index}`}
                            name={`${props.questionChoixMultiple.id}`}
                            value={possibleAnswer}
                            checked={choice === index}
                            onChange={() => onChooseQcmAnswer(index)}
                        />
                        <label htmlFor={`${qcmId}-${index}`}>{possibleAnswer}</label>
                    </React.Fragment>
                ),
            )}
        </div>
    );

    function onChooseQcmAnswer(newChoice: number) {
        setChoice(newChoice);
        upsertQcmAnswerMutation.mutate({
            attemptId: props.attemptId,
            qcmId: `${props.questionChoixMultiple.id}`,
            choice: newChoice,
        });
    }
}

export { QuestionChoixMultipleAnswering };
