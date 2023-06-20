import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { QuestionChoixMultipleEdition } from '../components/QuestionChoixMultipleEdition';
import { QuestionTrouEdition } from '../components/QuestionTrouEdition';

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
    const createQuestionTrouMutation = useMutation({
        mutationFn: api.createQuestionTrou,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', examId] });
        },
    });

    return (
        <div>
            {query.data?.questionsChoixMultiple.map((questionChoixMultiple: any) => (
                <QuestionChoixMultipleEdition
                    key={`${examId}-${questionChoixMultiple.id}`}
                    examId={examId}
                    questionChoixMultiple={questionChoixMultiple}
                />
            ))}
            {query.data?.questionsTrou.map((questionTrou: any) => (
                <QuestionTrouEdition
                    key={`${examId}-${questionTrou.id}`}
                    examId={examId}
                    questionTrou={questionTrou}
                />
            ))}
            <hr />
            <button onClick={addNewQuestionChoixMultiple}>
                Ajouter une nouvelle question à choix multiple
            </button>
            <button onClick={addNewQuestionTrou}>Ajouter une nouvelle question à trou</button>
            <hr />
            <Link to="/teacher/exams">Revenir à la liste des examens</Link>
        </div>
    );

    function addNewQuestionChoixMultiple() {
        createQcmMutation.mutate(params.examId as string);
    }

    function addNewQuestionTrou() {
        createQuestionTrouMutation.mutate(params.examId as string);
    }
}

export { ExamEdition };
