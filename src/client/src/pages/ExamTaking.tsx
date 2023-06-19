import React from 'react';
import { Navigate, redirect, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { QuestionAnswering } from '../components/QuestionAnswering';

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

    return !!query.data ? (
        <div>
            <h1>{query.data.exam.name}</h1>
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
    ) : (
        <div />
    );

    function validateForm() {
        mutation.mutate(attemptId);
    }
}

export { ExamTaking };
