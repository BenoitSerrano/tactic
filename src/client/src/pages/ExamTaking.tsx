import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { QuestionChoixMultipleAnswering } from '../components/QuestionChoixMultipleAnswering';
import { Countdown } from '../components/Countdown';
import { time } from '../lib/time';

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
        <div>
            <h1>{query.data.exam.name}</h1>
            <Countdown remainingSeconds={remainingSeconds} />
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
            <hr />
            <button onClick={validateForm}>Valider le questionnaire</button>
        </div>
    );

    function validateForm() {
        mutation.mutate(attemptId);
    }
}

export { ExamTaking };
