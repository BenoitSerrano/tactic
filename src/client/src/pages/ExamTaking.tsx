import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { QuestionChoixMultipleAnswering } from '../components/QuestionChoixMultipleAnswering';
import { Countdown } from '../components/Countdown';
import { time } from '../lib/time';
import { QuestionTrouAnswering } from '../components/QuestionTrouAnswering';
import { Page } from '../components/Page';
import { Button, Typography, styled } from '@mui/material';

function ExamTaking() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const studentId = params.studentId as string;
    const navigate = useNavigate();
    const query = useQuery(['attempts', attemptId], () => api.fetchAttempt(attemptId));
    const mutation = useMutation({
        mutationFn: api.endAttempt,
        onSuccess: () => {
            navigate(`/student/${studentId}/exam-done`);
        },
    });

    if (!query.data) {
        return <div />;
    }

    if (query.data.endedAt) {
        return <Navigate to="/student/attempt-already-submitted" />;
    }

    let remainingSeconds =
        query.data.exam.duration * 60 - time.computeElapsedTime(query.data.startedAt, new Date());
    if (remainingSeconds + query.data.exam.extraTime * 60 < 0) {
        api.endAttempt(attemptId);
        return <Navigate to="/student/attempt-timeout" />;
    }

    return (
        <Page>
            <Typography variant="h1">{query.data.exam.name}</Typography>
            <CountdownContainer>
                <Countdown remainingSeconds={remainingSeconds} />
            </CountdownContainer>
            {query.data.exam.questionsChoixMultiple.map(
                (questionChoixMultiple: any, index: number) => (
                    <QuestionChoixMultipleAnswering
                        key={questionChoixMultiple.id}
                        attemptId={attemptId}
                        index={index}
                        questionChoixMultiple={questionChoixMultiple}
                    />
                ),
            )}
            {query.data.exam.questionsTrou.map((questionTrou: any, index: number) => (
                <QuestionTrouAnswering
                    key={questionTrou.id}
                    attemptId={attemptId}
                    index={index}
                    questionTrou={questionTrou}
                />
            ))}
            <hr />
            <Button variant="contained" onClick={validateForm}>
                Valider le questionnaire
            </Button>
        </Page>
    );

    function validateForm() {
        mutation.mutate(attemptId);
    }
}

export { ExamTaking };

const CountdownContainer = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
});
