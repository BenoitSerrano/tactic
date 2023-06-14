import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { QuestionEdition } from '../components/QuestionEdition';

function ExamEdition() {
    const params = useParams<{ examId: string }>();
    const queryClient = useQueryClient();
    const query = useQuery(['exams', params.examId], () => api.fetchExam(params.examId as string));
    const mutation = useMutation({
        mutationFn: api.createQuestionChoixMultiple,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', params.examId] });
        },
    });

    return (
        <div>
            {query.data?.questionsChoixMultiple.map((questionChoixMultiple: any) => (
                <QuestionEdition questionChoixMultiple={questionChoixMultiple} />
            ))}
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
