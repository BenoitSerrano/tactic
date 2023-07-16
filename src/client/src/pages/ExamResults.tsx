import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import HistoryIcon from '@mui/icons-material/History';
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
import { Loader } from '../components/Loader';

type examResultApiType = {
    id: string;
    email: string;
    comment?: string;
    attemptId: string;
    startedAt: number;
    duration: number | undefined;
    mark: number;
    hasBeenTreated: boolean;
};

type examResultsApiType = { results: Array<examResultApiType>; totalPoints: number };

type sortColumnType = 'email' | 'mark' | 'startedAt';

function ExamResults() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const params = useParams();
    const examId = params.examId as string;
    const query = useQuery<examResultsApiType>({
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
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    const formattedData = formatData(query.data.results);

    const sortedData = sortData(formattedData, activeSort, sortDirection);

    return (
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell width={120}>Actions</TableCell>
                    <TableCell width={120}>
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
                            Heure de début
                        </TableSortLabel>
                    </TableCell>
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
                    <TableCell width={80}>
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
                            Note (/ {query.data.totalPoints})
                        </TableSortLabel>
                    </TableCell>
                    <TableCell width={50}>Durée</TableCell>

                    <TableCell>Commentaire de l'étudiant.e</TableCell>
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
                                    title="Réinitialiser"
                                    onClick={buildDeleteAttempt(result.attemptId)}
                                >
                                    <HistoryIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell>{time.formatToReadableDatetime(result.startedAt)}</TableCell>
                            <TableCell>
                                <Link
                                    to={`/teacher/${authentication.getEncodedPassword()}/exams/${examId}/results/${
                                        result.attemptId
                                    }`}
                                >
                                    {result.email}
                                </Link>
                            </TableCell>
                            <TableCell>{result.mark}</TableCell>
                            <TableCell>{result.duration}</TableCell>
                            <TableCell>{result.comment}</TableCell>
                        </StyledRow>
                    );
                })}
            </TableBody>
        </Table>
    );

    function buildDeleteAttempt(attemptId: string) {
        return () => {
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm('Souhaitez-vous réellement réinitialiser ce test ?');
            if (hasConfirmed) {
                deleteAttemptMutation.mutate(attemptId);
            }
        };
    }

    function buildGoToAttempt(attemptId: string) {
        return () => {
            navigate(
                `/teacher/${authentication.getEncodedPassword()}/exams/${examId}/results/${attemptId}`,
            );
        };
    }

    function buildUpdateTreatementStatus(attemptId: string, hasBeenTreated: boolean) {
        return () => {
            updateAttemptTreatementStatusMutation.mutate({ attemptId, hasBeenTreated });
        };
    }

    function formatData(data: examResultsApiType['results']) {
        return data.map((result) => {
            return {
                email: result.email,
                attemptId: result.attemptId,
                startedAt: result.startedAt,
                duration:
                    result.duration !== undefined
                        ? time.formatToClock(result.duration, { hideHours: true })
                        : '-',
                mark: result.mark,
                hasBeenTreated: result.hasBeenTreated,
                comment: result.comment,
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

export { ExamResults };
