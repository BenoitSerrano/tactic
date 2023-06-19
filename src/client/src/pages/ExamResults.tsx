import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import { api } from '../lib/api';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { time } from '../lib/time';

type examResultsType = Array<{
    id: string;
    email: string;
    attemptId: string;
    startedAt: number;
    duration: number | undefined;
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
    if (!query.data) {
        return <div />;
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Adresse e-mail</TableCell>
                    <TableCell>Heure de début du test</TableCell>
                    <TableCell>Durée</TableCell>
                    <TableCell>Note</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {query.data.map((result) => (
                    <TableRow key={result.attemptId}>
                        <TableCell>
                            <Link to={`/teacher/attempts/${result.attemptId}`}>{result.email}</Link>
                        </TableCell>
                        <TableCell>{time.formatToReadableDatetime(result.startedAt)}</TableCell>
                        <TableCell>
                            {result.duration
                                ? time.formatToClock(result.duration, { hideHours: true })
                                : '-'}
                        </TableCell>
                        <TableCell>
                            {result.mark}/{result.totalPoints}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        // <table>
        //     <thead>
        //         <tr>
        //             <th>Nom</th>
        //             <th>Note</th>
        //         </tr>
        //     </thead>
        //     <tbody>
        //         {query.data.map((result) => (
        //             <tr key={result.attemptId}>
        //                 <td>
        //                     <Link to={`/teacher/attempts/${result.attemptId}`}>{result.email}</Link>
        //                 </td>
        //                 <td>
        //                     {result.mark}/{result.totalPoints}
        //                 </td>
        //             </tr>
        //         ))}
        //     </tbody>
        // </table>
    );
}

export { ExamResults };
