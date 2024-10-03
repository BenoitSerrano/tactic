import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import NoEncryptionGmailerrorredIcon from '@mui/icons-material/NoEncryptionGmailerrorred';
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
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
import { attemptsCountByAttemptStatusApiType } from '../../types';
import { computeAttemptStatusIcon } from '../../lib/computeAttemptStatusIcon';
import { useAlert } from '../../lib/alert';
import { pathHandler } from '../../lib/pathHandler';
import { computeCanLockAttempt } from './lib/computeCanLockAttempt';
import { computeCanUnlockAttempt } from './lib/computeCanUnlockAttempt';
import { Menu } from '../../components/Menu';
import { computeRoundMark } from '../../lib/computeRoundMark';
import { IconLink } from '../../components/IconLink';
import { denominatorHandler, denominatorType } from './lib/denominatorHandler';
import { examResultsApiType } from './types';
import { createCsv } from './lib/createCsv';

type sortColumnType = 'email' | 'mark' | 'startedAt';

function ExamResults() {
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
            title: 'Télécharger les résultats',
            onClick: () => downloadResultsCsv(resultsQuery.data),
            IconComponent: DownloadIcon,
            shape: 'outlined' as const,
        },
        {
            title: 'Actualiser',
            onClick: resultsQuery.refetch,
            IconComponent: RefreshIcon,
            isLoading: resultsQuery.isLoading,
        },
    ];

    const roundedTotalPoints = computeRoundMark(resultsQuery.data.totalPoints);

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
                        <TableCell width={60}>Actions</TableCell>
                        <TableCell width={90}>
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
                                Heure début
                            </TableSortLabel>
                        </TableCell>
                        {!!resultsQuery.data.examDuration && (
                            <TableCell width={90}>Heure limite</TableCell>
                        )}
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
                        <TableCell width={40}>
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
                        <TableCell width={80}>Statut</TableCell>
                        <TableCell width={50}>Durée</TableCell>
                        <TableCell width={50}>Sorties d'examen</TableCell>
                        <TableCell width={50}>Temps total hors examen</TableCell>
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
                        const deadlineDate = time.addSeconds(
                            result.startedAt,
                            resultsQuery.data.examDuration * 60,
                        );
                        const readableDeadlineDate = time.formatToReadable(deadlineDate);
                        return (
                            <TableRow key={result.attemptId}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <TableCellContent>
                                        <IconLink
                                            to={computeAttemptRoute(result.attemptId)}
                                            IconComponent={FindInPageIcon}
                                            title="Voir la copie"
                                        />

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
                                            <IconButton
                                                onClick={buildDeleteAttempt(result.attemptId)}
                                            >
                                                <HistoryIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCellContent>
                                </TableCell>
                                <TableCell>
                                    {time.formatToReadable(new Date(result.startedAt))}
                                </TableCell>
                                {!!resultsQuery.data.examDuration && (
                                    <TableCell>{readableDeadlineDate}</TableCell>
                                )}
                                <TableCell>
                                    <Link to={computeAttemptRoute(result.attemptId)}>
                                        {result.email}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <MarksContainer>
                                        <div>
                                            {computeDisplayedMark(
                                                result.mark,
                                                resultsQuery.data.totalPoints,
                                                'original',
                                            )}
                                             / {roundedTotalPoints}
                                        </div>
                                        <div>
                                            <BoldContainer>
                                                {computeDisplayedMark(
                                                    result.mark,
                                                    resultsQuery.data.totalPoints,
                                                    '20',
                                                )}
                                                 / 20
                                            </BoldContainer>
                                        </div>
                                    </MarksContainer>
                                </TableCell>
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

    function computeDisplayedMark(mark: number, totalPoints: number, denominator: denominatorType) {
        switch (denominator) {
            case '20':
                const convertedMark = denominatorHandler.convertMark(
                    mark,
                    totalPoints,
                    denominator,
                );
                return computeRoundMark(convertedMark);
            case 'original':
                return computeRoundMark(mark);
        }
    }

    function computeSubtitle(attemptsCountByAttemptStatus: attemptsCountByAttemptStatusApiType) {
        const { corrected, notCorrected } = attemptsCountByAttemptStatus;
        return `Copies corrigées : ${corrected}/${notCorrected + corrected}`;
    }

    function buildDeleteAttempt(attemptId: string) {
        return () => {
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm('Souhaitez-vous réellement réinitialiser cet examen ?');
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

    function downloadResultsCsv(examResultsApi: examResultsApiType) {
        const csv = createCsv(examResultsApi, [
            'email',
            'lastName',
            'firstName',
            'totalMark',
            'convertedMark',
            'actualDuration',
            'roundTrips',
            'timeSpentOutside',
        ]);
        const data = csv.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Résultats - ${examResultsApi.examName}.csv`;
        a.click();
    }
}

const TitleContainer = styled('div')(({ theme }) => ({
    textAlign: 'center',
}));

const TableCellContent = styled('div')({ display: 'flex', alignItems: 'center' });

const MarksContainer = styled('div')({ display: 'flex', flexDirection: 'column' });
const BoldContainer = styled('span')({ fontWeight: 'bolder' });

export { ExamResults };
