import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
    Tooltip,
} from '@mui/material';
import { time } from '../lib/time';
import { Loader } from '../components/Loader';
import { attemptStatusType } from '../types';
import { computeAttemptStatusIcon } from '../lib/computeAttemptStatusIcon';

type examResultApiType = {
    id: string;
    email: string;
    attemptId: string;
    startedAt: string;
    attemptStatus: attemptStatusType;
    actualDuration: number | undefined;
    mark: number;
    roundTrips: number;
    timeSpentOutside: number;
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

    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    const formattedData = formatData(query.data.results);

    const sortedData = sortData(formattedData, activeSort, sortDirection);
    const sortedAttemptIds = sortedData.map(({ attemptId }) => attemptId);

    return (
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell width={20}>N°</TableCell>
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
                    <TableCell width={80}>Statut</TableCell>
                    <TableCell width={50}>Durée</TableCell>
                    <TableCell width={50}>Sorties de test</TableCell>
                    <TableCell width={50}>Temps total hors test</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {sortedData.map((result, index) => {
                    const AttemptStatusIcon = computeAttemptStatusIcon(result.attemptStatus);
                    return (
                        <TableRow key={result.attemptId}>
                            <TableCell>{index + 1}</TableCell>

                            <TableCell>
                                <Tooltip title="Voir la copie">
                                    <IconButton onClick={buildGoToAttempt(result.attemptId)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Réinitialiser">
                                    <IconButton onClick={buildDeleteAttempt(result.attemptId)}>
                                        <HistoryIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{time.formatToReadableDatetime(result.startedAt)}</TableCell>
                            <TableCell>
                                <Link to={computeAttemptRoute(result.attemptId)}>
                                    {result.email}
                                </Link>
                            </TableCell>
                            <TableCell>{result.mark.toFixed(1)}</TableCell>
                            <TableCell>{AttemptStatusIcon}</TableCell>
                            <TableCell>{result.actualDuration}</TableCell>
                            <TableCell>{result.roundTrips}</TableCell>
                            <TableCell>{result.timeSpentOutside}</TableCell>
                        </TableRow>
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

    function computeAttemptRoute(attemptId: string) {
        return `/teacher/exams/${examId}/results/${attemptId}?attemptIds=${sortedAttemptIds.join(
            ',',
        )}`;
    }

    function buildGoToAttempt(attemptId: string) {
        return () => {
            navigate(computeAttemptRoute(attemptId));
        };
    }

    function formatData(data: examResultsApiType['results']) {
        return data.map((result) => {
            return {
                email: result.email,
                attemptId: result.attemptId,
                startedAt: result.startedAt,
                actualDuration:
                    result.actualDuration !== undefined
                        ? time.formatToClock(result.actualDuration, { hideHours: true })
                        : '-',
                mark: result.mark,
                attemptStatus: result.attemptStatus,
                roundTrips: result.roundTrips,
                timeSpentOutside: time.formatToClock(Math.floor(result.timeSpentOutside / 1000), {
                    hideHours: true,
                }),
            };
        });
    }

    function sortData<T extends { email: string; mark: number; startedAt: string }>(
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
                    result =
                        new Date(resultA.startedAt).getTime() -
                        new Date(resultB.startedAt).getTime();
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
