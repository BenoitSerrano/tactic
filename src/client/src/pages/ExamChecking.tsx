import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { QuestionChoixMultipleChecking } from '../components/QuestionChoixMultipleChecking';

function ExamChecking() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const query = useQuery(['attempts', attemptId], () => api.fetchAttempt(attemptId));

    return !!query.data ? (
        <div>
            <h1>{query.data.exam.name}</h1>
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
        </div>
    ) : (
        <div />
    );
}

export { ExamChecking };
