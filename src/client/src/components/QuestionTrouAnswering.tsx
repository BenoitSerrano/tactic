import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { debounce } from '../lib/utils';
import { api } from '../lib/api';
import { TextField, Typography } from '@mui/material';

function QuestionTrouAnswering(props: {
    questionTrou: {
        id: number;
        beforeText: string;
        afterText: string;
        answer: string;
    };
    index: number;
    attemptId: string;
}) {
    const [answer, setAnswer] = useState(props.questionTrou.answer);
    const createOrUpdateQuestionTrouAnswerMutation = useMutation({
        mutationFn: api.createOrUpdateQuestionTrouAnswer,
    });

    return (
        <div>
            <p>{props.index + 1}.</p>
            <Typography>{props.questionTrou.beforeText}</Typography>
            <TextField label="Réponse" value={answer} onChange={onChangeAnswer} placeholder="..." />
            <Typography>{props.questionTrou.afterText}</Typography>
        </div>
    );

    function onChangeAnswer(event: React.ChangeEvent<HTMLInputElement>) {
        setAnswer(event.target.value);

        debounce((newAnswer: string) => {
            return createOrUpdateQuestionTrouAnswerMutation.mutate({
                attemptId: props.attemptId,
                questionTrouId: props.questionTrou.id,
                answer: newAnswer,
            });
        })(event.target.value);
    }
}

export { QuestionTrouAnswering };
