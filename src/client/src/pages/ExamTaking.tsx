import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { QuestionAnswering } from '../components/QuestionAnswering';
import { Countdown } from '../components/Countdown';
import { computeElapsedTime } from '../lib/time';

function ExamTaking() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const navigate = useNavigate();
    const query = useQuery(['attempts', attemptId], () => api.fetchAttempt(attemptId));
    const mutation = useMutation({
        mutationFn: api.endAttempt,
        onSuccess: () => {
            navigate('/student/exam-done');
        },
    });

    if (query.data && query.data.endedAt) {
        return <Navigate to="/student/attempt-already-submitted" />;
    }

    if (!query.data) {
        return <div />;
    }

    const remainingSeconds =
        query.data.exam.duration * 60 - computeElapsedTime(query.data.startedAt, new Date());

    return (
        <div>
            <h1>{query.data.exam.name}</h1>
            <Countdown remainingSeconds={remainingSeconds} />
            {query.data.exam.questionsChoixMultiple.map(
                (questionChoixMultiple: any, index: number) => (
                    <QuestionAnswering
                        key={questionChoixMultiple.id}
                        attemptId={attemptId}
                        index={index}
                        questionChoixMultiple={questionChoixMultiple}
                    />
                ),
            )}
            <hr />
            <button onClick={validateForm}>Valider le questionnaire</button>
        </div>
    );

    function validateForm() {
        mutation.mutate(attemptId);
    }
}

export { ExamTaking };
