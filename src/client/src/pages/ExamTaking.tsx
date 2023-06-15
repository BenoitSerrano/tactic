import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { QuestionEdition } from '../components/QuestionEdition';

function ExamTaking() {
    const params = useParams<{ examId: string }>();
    const examId = params.examId as string;
    const query = useQuery(['exams', examId], () => api.fetchExam(examId));

    return (
        <div>
            {query.data?.questionsChoixMultiple.map((questionChoixMultiple: any) => (
                <QuestionEdition examId={examId} questionChoixMultiple={questionChoixMultiple} />
            ))}
        </div>
    );
}

export { ExamTaking };
