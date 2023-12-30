import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryIcon from '@mui/icons-material/History';
import NoEncryptionGmailerrorredIcon from '@mui/icons-material/NoEncryptionGmailerrorred';
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import { api } from '../../lib/api';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
    Typography,
    styled,
} from '@mui/material';
import { time } from '../../lib/time';
import { Loader } from '../../components/Loader';
import { attemptStatusType, attemptsCountByAttemptStatusApiType } from '../../types';
import { computeAttemptStatusIcon } from '../../lib/computeAttemptStatusIcon';
import { useAlert } from '../../lib/alert';
import { pathHandler } from '../../lib/pathHandler';
import { computeCanLockAttempt } from './lib/computeCanLockAttempt';
import { computeCanUnlockAttempt } from './lib/computeCanUnlockAttempt';
import { Menu } from '../../components/Menu';
import { computeRoundMark } from '../../lib/computeRoundMark';

type examResultApiType = {
    id: string;
    email: string;
    attemptId: string;
    startedAt: string;
    isTimeLimitExceeded: boolean;
    attemptStatus: attemptStatusType;
    actualDuration: number | undefined;
    mark: number;
    roundTrips: number;
    timeSpentOutside: number;
};

type examResultsApiType = {
    results: Array<examResultApiType>;
    totalPoints: number;
    examName: string;
};

type sortColumnType = 'email' | 'mark' | 'startedAt';

function ExamResults() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const params = useParams();
    const examId = params.examId as string;
    const resultsQuery = useQuery<examResultsApiType>({
        queryKey: ['exam-results', examId],
        queryFn: () => api.fetchExamResults(examId),
    });

    const attemptsCountQuery = useQuery<attemptsCountByAttemptStatusApiType>({
        queryFn: () => api.fetchAttemptsCountByCorrectionStatus({ examId }),
        queryKey: ['attempts-count-by-attempt-status', examId],
    });

    const [activeSort, setActiveSort] = useState<sortColumnType>('startedAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const { displayAlert } = useAlert();
    const deleteAttemptMutation = useMutation({
        mutationFn: api.deleteAttempt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exam-results'] });
        },
        onError: (error: any) => {
            displayAlert({
                variant: 'error',
                text: "L'opération a échoué.",
            });
            console.error(error);
        },
    });

    const lockAttemptMutation = useMutation({
        mutationFn: api.updateEndedAt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exam-results'] });
            displayAlert({
                variant: 'success',
                text: "L'examen a bien été terminé pour cet étudiant. Il ne pourra plus modifier sa copie",
            });
        },
        onError: (error: any) => {
            displayAlert({
                variant: 'error',
                text: "L'opération a échoué.",
            });
            console.error(error);
        },
    });

    const unlockAttemptMutation = useMutation({
        mutationFn: api.deleteEndedAt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exam-results'] });
            displayAlert({
                variant: 'success',
                text: "L'étudiant peut de nouveau accéder à sa copie, dans la limite du temps imparti.",
            });
        },
        onError: (error: any) => {
            displayAlert({
                variant: 'error',
                text: "L'opération a échoué.",
            });
            console.error(error);
        },
    });

    if (!resultsQuery.data || !attemptsCountQuery.data) {
        if (resultsQuery.isLoading || !attemptsCountQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    const formattedData = formatData(resultsQuery.data.results);

    const sortedData = sortData(formattedData, activeSort, sortDirection);
    const sortedAttemptIds = sortedData.map(({ attemptId }) => attemptId);
    const title = resultsQuery.data.examName;
    const subtite = computeSubtitle(attemptsCountQuery.data);
    const menuButtons = [
        {
            title: 'Rafraîchir',
            onClick: resultsQuery.refetch,
            IconComponent: RefreshIcon,
            isLoading: resultsQuery.isLoading,
        },
    ];

    return (
        <>
            <TitleContainer>
                <Typography variant="h3">{title}</Typography>
                <Typography variant="h4">{subtite}</Typography>
            </TitleContainer>
            <Menu buttons={menuButtons} />

            <Table>
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
                                Note (/ {resultsQuery.data.totalPoints})
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
                        const canLockAttempt = computeCanLockAttempt(result.attemptStatus);
                        const canUnlockAttempt = computeCanUnlockAttempt(
                            result.attemptStatus,
                            result.isTimeLimitExceeded,
                        );
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

                                    {canLockAttempt && (
                                        <Tooltip title="Terminer l'examen pour cet étudiant">
                                            <IconButton
                                                onClick={buildLockAttempt(result.attemptId)}
                                            >
                                                <LockIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    {canUnlockAttempt && (
                                        <Tooltip title="Permettre à l'étudiant de reprendre l'examen">
                                            <IconButton
                                                onClick={buildUnlockAttempt(result.attemptId)}
                                            >
                                                <NoEncryptionGmailerrorredIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    <Tooltip title="Réinitialiser">
                                        <IconButton onClick={buildDeleteAttempt(result.attemptId)}>
                                            <HistoryIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    {time.formatToReadableDatetime(result.startedAt)}
                                </TableCell>
                                <TableCell>
                                    <Link to={computeAttemptRoute(result.attemptId)}>
                                        {result.email}
                                    </Link>
                                </TableCell>
                                <TableCell>{computeRoundMark(result.mark)}</TableCell>
                                <TableCell>{AttemptStatusIcon}</TableCell>
                                <TableCell>{result.actualDuration}</TableCell>
                                <TableCell>{result.roundTrips}</TableCell>
                                <TableCell>{result.timeSpentOutside}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );

    function computeSubtitle(attemptsCountByAttemptStatus: attemptsCountByAttemptStatusApiType) {
        const { corrected, notCorrected } = attemptsCountByAttemptStatus;
        return `Copies corrigées : ${corrected}/${notCorrected + corrected}`;
    }

    function buildDeleteAttempt(attemptId: string) {
        return () => {
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm('Souhaitez-vous réellement réinitialiser ce test ?');
            if (hasConfirmed) {
                deleteAttemptMutation.mutate({ attemptId, examId });
            }
        };
    }

    function buildLockAttempt(attemptId: string) {
        return () => {
            lockAttemptMutation.mutate({ attemptId });
        };
    }

    function buildUnlockAttempt(attemptId: string) {
        return () => {
            unlockAttemptMutation.mutate({ attemptId, examId });
        };
    }

    function computeAttemptRoute(attemptId: string) {
        return pathHandler.getRoutePath(
            'EXAM_CHECKING',
            { examId, attemptId },
            { attemptIds: sortedAttemptIds.join(',') },
        );
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
                isTimeLimitExceeded: result.isTimeLimitExceeded,
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

const TitleContainer = styled('div')(({ theme }) => ({
    textAlign: 'center',
}));

export { ExamResults };
