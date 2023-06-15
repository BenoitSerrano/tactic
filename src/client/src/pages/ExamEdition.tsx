import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { QuestionEdition } from '../components/QuestionEdition';

function ExamEdition() {
    const params = useParams<{ examId: string }>();
    const examId = params.examId as string;
    const queryClient = useQueryClient();
    const query = useQuery(['exams', examId], () => api.fetchExam(examId));
    const createQcmMutation = useMutation({
        mutationFn: api.createQuestionChoixMultiple,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', examId] });
        },
    });

    return (
        <div>
            {query.data?.questionsChoixMultiple.map((questionChoixMultiple: any) => (
                <QuestionEdition
                    key={`${examId}-${questionChoixMultiple.id}`}
                    examId={examId}
                    questionChoixMultiple={questionChoixMultiple}
                />
            ))}
            <button onClick={addNewQuestionChoixMultiple}>
                Ajouter une nouvelle question à choix multiple
            </button>
        </div>
    );

    function addNewQuestionChoixMultiple() {
        createQcmMutation.mutate(params.examId as string);
    }
}

export { ExamEdition };
