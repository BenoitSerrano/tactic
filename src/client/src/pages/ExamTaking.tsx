import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { QuestionAnswering } from '../components/QuestionAnswering';

function ExamTaking() {
    const params = useParams();
    const examId = params.examId as string;
    const attemptId = params.attemptId as string;
    const query = useQuery(['exams', examId], () => api.fetchExam(examId));

    return (
        <div>
            <h1>{query.data?.name}</h1>
            {query.data?.questionsChoixMultiple.map((questionChoixMultiple: any) => (
                <QuestionAnswering
                    attemptId={attemptId}
                    questionChoixMultiple={questionChoixMultiple}
                />
            ))}
        </div>
    );
}

export { ExamTaking };
