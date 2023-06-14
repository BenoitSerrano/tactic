import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

function ExamEdition() {
    const params = useParams<{ examId: string }>();
    const query = useQuery(['exams', params.examId], () => api.fetchExam(params.examId as string));
    const mutation = useMutation({
        mutationFn: api.createQuestionChoixMultiple,
    });

    return (
        <div>
            <button onClick={addNewQuestionChoixMultiple}>
                Ajouter une nouvelle question à choix multiple
            </button>
        </div>
    );

    function addNewQuestionChoixMultiple() {
        mutation.mutate(params.examId as string);
    }
}

export { ExamEdition };
