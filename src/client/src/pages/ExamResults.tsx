import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import { api } from '../lib/api';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    styled,
} from '@mui/material';
import { time } from '../lib/time';
import { authentication } from '../lib/authentication';

type examResultType = {
    id: string;
    email: string;
    comment?: string;
    attemptId: string;
    startedAt: number;
    duration: number | undefined;
    qcmSummary: Record<number, { status: 'right' | 'wrong'; choice: number; points: number }>;
    phraseMelangeeSummary: Record<number, { status: 'right' | 'wrong'; points: number }>;
    questionTrouSummary: Record<
        number,
        { status: 'right' | 'acceptable' | 'wrong'; answer: string; points: number }
    >;
    hasBeenTreated: boolean;
    totalPoints: number;
};

type examResultsType = Array<examResultType>;

type sortColumnType = 'email' | 'mark' | 'startedAt';

function ExamResults() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const params = useParams();
    const examId = params.examId as string;
    const query = useQuery<examResultsType>({
        queryKey: ['examResults', examId],
        queryFn: () => api.fetchExamResults(examId),
    });
    const [activeSort, setActiveSort] = useState<sortColumnType>('startedAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const deleteAttemptMutation = useMutation({
        mutationFn: api.deleteAttempt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examResults'] });
        },
    });

    const updateAttemptTreatementStatusMutation = useMutation({
        mutationFn: api.updateAttemptTreatementStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examResults'] });
        },
    });

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
                    <TableCell>
                        <TableSortLabel
                            active={activeSort === 'startedAt'}
                            direction={sortDirection}
                            onClick={() => {
                                if (activeSort !== 'startedAt') {
                                    setActiveSort('startedAt');
                                }
                                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            }}
                        >
                            Heure de début du test
                        </TableSortLabel>
                    </TableCell>
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
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {sortedData.map((result) => {
                    const isHighlighted = result.hasBeenTreated;
                    const StyledRow = isHighlighted
                        ? styled(TableRow)({ backgroundColor: '#ccffcc' })
                        : TableRow;
                    return (
                        <StyledRow key={result.attemptId}>
                            <TableCell>{result.email}</TableCell>
                            <TableCell>{time.formatToReadableDatetime(result.startedAt)}</TableCell>
                            <TableCell>{result.duration}</TableCell>
                            <TableCell>{`${result.mark} / ${result.totalPoints}`}</TableCell>
                            <TableCell>{result.comment || '-'}</TableCell>
                            <TableCell>
                                <IconButton
                                    title="Voir la copie"
                                    onClick={buildGoToAttempt(result.attemptId)}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                                <IconButton
                                    title={
                                        'Marquer comme' +
                                        (result.hasBeenTreated ? ' non ' : ' ') +
                                        'traité'
                                    }
                                    onClick={buildUpdateTreatementStatus(
                                        result.attemptId,
                                        !result.hasBeenTreated,
                                    )}
                                >
                                    {result.hasBeenTreated ? <RemoveDoneIcon /> : <DoneAllIcon />}
                                </IconButton>
                                <IconButton
                                    title="Supprimer"
                                    onClick={buildDeleteAttempt(result.attemptId)}
                                >
                                    <DeleteForeverIcon />
                                </IconButton>
                            </TableCell>
                        </StyledRow>
                    );
                })}
            </TableBody>
        </Table>
    );

    function buildDeleteAttempt(attemptId: string) {
        return () => {
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm('Souhaitez-vous réellement supprimer cette copie ?');
            if (hasConfirmed) {
                deleteAttemptMutation.mutate(attemptId);
            }
        };
    }

    function buildGoToAttempt(attemptId: string) {
        return () => {
            navigate(`/teacher/${authentication.getEncodedPassword()}/attempts/${attemptId}`);
        };
    }

    function buildUpdateTreatementStatus(attemptId: string, hasBeenTreated: boolean) {
        return () => {
            updateAttemptTreatementStatusMutation.mutate({ attemptId, hasBeenTreated });
        };
    }

    function formatData(data: examResultType[]) {
        return data.map((result) => {
            const { mark, totalPoints } = computeMark(result);
            return {
                email: result.email,
                attemptId: result.attemptId,
                startedAt: result.startedAt,
                duration:
                    result.duration !== undefined
                        ? time.formatToClock(result.duration, { hideHours: true })
                        : '-',
                mark,
                totalPoints,
                hasBeenTreated: result.hasBeenTreated,
                comment: result.comment || '-',
            };
        });
    }

    function sortData<T extends { email: string; mark: number; startedAt: number }>(
        data: Array<T>,
        activeSort: sortColumnType,
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
                    break;
                case 'startedAt':
                    result = resultA.startedAt - resultB.startedAt;
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
    const phraseMelangeeTotalPoints = Object.values(examResult.phraseMelangeeSummary).reduce(
        (sum, summary) => sum + summary.points,
        0,
    );
    const qcmMark = Object.values(examResult.qcmSummary).reduce(
        (sum, value) => sum + (value.status === 'right' ? value.points : 0),
        0,
    );
    const phraseMelangeeMark = Object.values(examResult.phraseMelangeeSummary).reduce(
        (sum, value) => sum + (value.status === 'right' ? value.points : 0),
        0,
    );
    const questionTrouMark = Object.values(examResult.questionTrouSummary).reduce((sum, value) => {
        switch (value.status) {
            case 'right':
                return sum + value.points;
            case 'acceptable':
                return sum + value.points / 2;
        }
        return sum;
    }, 0);
    return {
        mark: qcmMark + questionTrouMark + phraseMelangeeMark,
        totalPoints: qcmTotalPoints + questionTrouTotalPoints + phraseMelangeeTotalPoints,
    };
}

export { ExamResults };
