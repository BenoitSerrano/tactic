import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

function ExamTaking() {
    const params = useParams();
    const examId = params.examId as string;
    console.log(params);
    const query = useQuery(['exams', examId], () => api.fetchExam(examId));

    return (
        <div>
            {query.data?.questionsChoixMultiple.map((questionChoixMultiple: any) => (
                <div>{questionChoixMultiple.title}</div>
            ))}
        </div>
    );
}

export { ExamTaking };
