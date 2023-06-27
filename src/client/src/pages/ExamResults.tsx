import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import { api } from '../lib/api';
import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { time } from '../lib/time';

type examResultType = {
    id: string;
    email: string;
    comment?: string;
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
    const [activeSort, setActiveSort] = useState<'email' | 'mark'>('email');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    if (!query.data) {
        return <div />;
    }

    const formattedData = formatData(query.data);

    const sortedData = sortData(formattedData, activeSort, sortDirection);

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell sortDirection={sortDirection}>
                        <TableSortLabel
                            active={activeSort === 'email'}
                            direction={sortDirection}
                            onClick={() => {
                                if (activeSort !== 'email') {
                                    setActiveSort('email');
                                }
                                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            }}
                        >
                            Adresse e-mail
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>Heure de début du test</TableCell>
                    <TableCell>Durée</TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={activeSort === 'mark'}
                            direction={sortDirection}
                            onClick={() => {
                                if (activeSort !== 'mark') {
                                    setActiveSort('mark');
                                }
                                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            }}
                        >
                            Note
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>Commentaire de l'étudiant.e</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {sortedData.map((result) => (
                    <TableRow key={result.attemptId}>
                        <TableCell>
                            <Link to={`/teacher/attempts/${result.attemptId}`}>{result.email}</Link>
                        </TableCell>
                        <TableCell>{result.startedAt}</TableCell>
                        <TableCell>{result.duration}</TableCell>
                        <TableCell>{`${result.mark} / ${result.totalPoints}`}</TableCell>
                        <TableCell>{result.comment || '-'}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    function formatData(data: examResultType[]) {
        return data.map((result) => {
            const { mark, totalPoints } = computeMark(result);
            return {
                email: result.email,
                attemptId: result.attemptId,
                startedAt: time.formatToReadableDatetime(result.startedAt),
                duration:
                    result.duration !== undefined
                        ? time.formatToClock(result.duration, { hideHours: true })
                        : '-',
                mark,
                totalPoints,
                comment: result.comment || '-',
            };
        });
    }

    function sortData<T extends { email: string; mark: number }>(
        data: Array<T>,
        activeSort: 'email' | 'mark',
        sortDirection: 'asc' | 'desc',
    ): Array<T> {
        return data.sort((resultA, resultB) => {
            let result = 0;
            switch (activeSort) {
                case 'email':
                    result = resultA.email.localeCompare(resultB.email);
                    break;
                case 'mark':
                    result = resultA.mark - resultB.mark;
            }
            if (sortDirection === 'asc') {
                return result;
            } else {
                if (result === 0) {
                    return 0;
                }
                return result > 0 ? -1 : 1;
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
    return {
        mark: qcmMark + questionTrouMark,
        totalPoints: qcmTotalPoints + questionTrouTotalPoints,
    };
}

export { ExamResults };
