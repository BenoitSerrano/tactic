import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { QuestionChoixMultipleChecking } from '../components/QuestionChoixMultipleChecking';
import { QuestionTrouChecking } from '../components/QuestionTrouChecking';
import { Typography } from '@mui/material';
import { Page } from '../components/Page';

function ExamChecking() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const query = useQuery(['attempts', attemptId], () => api.fetchAttempt(attemptId));

    return !!query.data ? (
        <Page>
            <Typography variant="h1">{query.data.exam.name}</Typography>
            {query.data.exam.questionsChoixMultiple.map(
                (questionChoixMultiple: any, index: number) => (
                    <QuestionChoixMultipleChecking
                        key={questionChoixMultiple.id}
                        attemptId={attemptId}
                        index={index}
                        questionChoixMultiple={questionChoixMultiple}
                    />
                ),
            )}
            <hr />
            {query.data.exam.questionsTrou.map((questionTrou: any, index: number) => (
                <QuestionTrouChecking
                    key={questionTrou.id}
                    attemptId={attemptId}
                    index={index}
                    questionTrou={questionTrou}
                />
            ))}
        </Page>
    ) : (
        <div />
    );
}

export { ExamChecking };
