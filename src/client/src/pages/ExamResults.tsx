import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';

type examResultsType = Array<{
    id: string;
    email: string;
    attemptId: string;
    mark: number;
    totalPoints: number;
}>;

function ExamResults() {
    const params = useParams();
    const examId = params.examId as string;
    const query = useQuery<examResultsType>({
        queryKey: ['examResults', examId],
        queryFn: () => api.fetchExamResults(examId),
    });

    return query.data ? (
        <table>
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Note</th>
                </tr>
            </thead>
            <tbody>
                {query.data.map((result) => (
                    <tr key={result.attemptId}>
                        <td>
                            <Link to={`/teacher/attempts/${result.attemptId}`}>{result.email}</Link>
                        </td>
                        <td>
                            {result.mark}/{result.totalPoints}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <div />
    );
}

export { ExamResults };
