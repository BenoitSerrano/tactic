import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { QuestionAnswering } from '../components/QuestionAnswering';

function ExamTaking() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const query = useQuery(['attempts', attemptId], () => api.fetchAttempt(attemptId));

    const data = adaptAttemptData(query?.data);

    return !!data ? (
        <div>
            <h1>{data.name}</h1>
            {data.questionsChoixMultiple.map((questionChoixMultiple: any, index: number) => (
                <QuestionAnswering
                    key={questionChoixMultiple.id}
                    attemptId={attemptId}
                    index={index}
                    questionChoixMultiple={questionChoixMultiple}
                />
            ))}
        </div>
    ) : (
        <div></div>
    );

    function adaptAttemptData(queryData: any) {
        if (!queryData) {
            return undefined;
        }

        const choices: Record<number, number> = {};
        queryData.qcmAnswers.forEach(
            (qcmAnswer: { questionChoixMultiple: { id: number }; choice: number }) => {
                const id = qcmAnswer.questionChoixMultiple.id;
                choices[id] = qcmAnswer.choice;
            },
        );

        return {
            name: queryData.exam.name,
            questionsChoixMultiple: queryData.exam.questionsChoixMultiple.map(
                (questionChoixMultiple: { id: number }) => ({
                    ...questionChoixMultiple,
                    choice: choices[questionChoixMultiple.id],
                }),
            ),
        };
    }
}

export { ExamTaking };
