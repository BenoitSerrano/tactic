import React from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useQuery } from '@tanstack/react-query';

function ExamEdition() {
    const params = useParams();
    const query = useQuery(['exams', params.examId], () => api.fetchExam(params.examId as string));

    return <div></div>;
}

export { ExamEdition };
