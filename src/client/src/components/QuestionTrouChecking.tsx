import React from 'react';
import { TextField, Typography } from '@mui/material';

function QuestionTrouChecking(props: {
    questionTrou: {
        id: number;
        beforeText: string;
        afterText: string;
        answer: string;
    };
    index: number;
    attemptId: string;
}) {
    return (
        <div>
            <p>{props.index + 1}.</p>
            <Typography>{props.questionTrou.beforeText}</Typography>
            <TextField disabled label="Réponse" value={props.questionTrou.answer} />
            <Typography>{props.questionTrou.afterText}</Typography>
        </div>
    );
}

export { QuestionTrouChecking };
