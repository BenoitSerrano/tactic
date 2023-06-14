import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

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
    console.log(query.data);

    return (
        <div>
            {query.data?.questionsChoixMultiple.map((questionChoixMultiple: any) => (
                <div>
                    <input
                        value={questionChoixMultiple.title}
                        placeholder="Intitulé de la question"
                    />
                    {questionChoixMultiple.possibleAnswers.map(
                        (possibleAnswer: string, possibleAnswerIndex: number) => {
                            const isRightAnswer =
                                possibleAnswerIndex === questionChoixMultiple.rightAnswerIndex;
                            return (
                                <React.Fragment key={possibleAnswer}>
                                    <input
                                        type="radio"
                                        id={possibleAnswer}
                                        name={questionChoixMultiple.id}
                                        value={possibleAnswer}
                                        checked={isRightAnswer}
                                        onChange={() => {}}
                                    />
                                    <input value={possibleAnswer} onChange={() => {}} />
                                </React.Fragment>
                            );
                        },
                    )}
                </div>
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
