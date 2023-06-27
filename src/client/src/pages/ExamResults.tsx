import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import { api } from '../lib/api';
import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { time } from '../lib/time';

type examResultType = {
    id: string;
    email: string;
    attemptId: string;
    startedAt: number;
    duration: number | undefined;
    qcmSummary: Record<number, { status: 'right' | 'wrong'; choice: number; points: number }>;
    questionTrouSummary: Record<
        number,
        { status: 'right' | 'acceptable' | 'wrong'; answer: string; points: number }
    >;
    totalPoints: number;
};

type examResultsType = Array<examResultType>;

function ExamResults() {
    const params = useParams();
    const examId = params.examId as string;
    const query = useQuery<examResultsType>({
        queryKey: ['examResults', examId],
        queryFn: () => api.fetchExamResults(examId),
    });
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    if (!query.data) {
        return <div />;
    }

    const sortedData = sortData(query.data, sortDirection);

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell sortDirection={sortDirection}>
                        <TableSortLabel
                            active
                            direction={sortDirection}
                            onClick={() =>
                                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                            }
                        >
                            Adresse e-mail
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>Heure de début du test</TableCell>
                    <TableCell>Durée</TableCell>
                    <TableCell>Note</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {sortedData.map((result) => (
                    <TableRow key={result.attemptId}>
                        <TableCell>
                            <Link to={`/teacher/attempts/${result.attemptId}`}>{result.email}</Link>
                        </TableCell>
                        <TableCell>{time.formatToReadableDatetime(result.startedAt)}</TableCell>
                        <TableCell>
                            {result.duration !== undefined
                                ? time.formatToClock(result.duration, { hideHours: true })
                                : '-'}
                        </TableCell>
                        <TableCell>{computeMark(result)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    function sortData<T extends { email: string }>(data: Array<T>, sortDirection: 'asc' | 'desc') {
        return data.sort((resultA, resultB) => {
            const result = resultA.email.localeCompare(resultB.email);
            if (sortDirection === 'asc') {
                return result;
            } else {
                if (result === 0) {
                    return 0;
                }
                return result === 1 ? -1 : 1;
            }
        });
    }
}

function computeMark(examResult: examResultType) {
    const qcmTotalPoints = Object.values(examResult.qcmSummary).reduce(
        (sum, summary) => sum + summary.points,
        0,
    );
    const questionTrouTotalPoints = Object.values(examResult.questionTrouSummary).reduce(
        (sum, summary) => sum + summary.points,
        0,
    );
    const qcmMark = Object.values(examResult.qcmSummary).reduce(
        (sum, value) => sum + (value.status === 'right' ? value.points : 0),
        0,
    );
    const questionTrouMark = Object.values(examResult.questionTrouSummary).reduce((sum, value) => {
        switch (value.status) {
            case 'right':
                return sum + value.points;
            case 'acceptable':
                return sum + value.points / 2;
            case 'wrong':
                return sum;
        }
    }, 0);
    return `${qcmMark + questionTrouMark}/${qcmTotalPoints + questionTrouTotalPoints}`;
}

export { ExamResults };
