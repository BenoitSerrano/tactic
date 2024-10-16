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
import { attemptsCountByAttemptStatusApiType, attemptStatusType } from '../../types';
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
import { attemptStatusMapping } from './constants';
import { downloadResultsToCsv } from './lib/downloadResultsToCsv';
import { ExamPageTitle } from '../../components/ExamPageTitle';

type sortColumnType =
    | 'email'
    | 'mark'
    | 'lastName'
    | 'firstName'
    | 'attemptStatus'
    | 'startedAt'
    | 'roundTrips'
    | 'actualDuration'
    | 'timeSpentOutside';

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
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
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
    const subtite = computeSubtitle(attemptsCountQuery.data);
    const menuButtons = [
        {
            title: 'Exporter les résultats',
            onClick: () => {},
            IconComponent: DownloadIcon,
            shape: 'outlined' as const,
            popupMenu: [
                {
                    IconComponent: DownloadIcon,
                    onClick: () => downloadResultsToCsv(resultsQuery.data),
                    label: 'Télécharger le .csv',
                },
            ],
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
                <ExamPageTitle examName={resultsQuery.data.examName} />
                <Typography variant="h4">{subtite}</Typography>
            </TitleContainer>
            <Menu buttons={menuButtons} />

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={20}>N°</TableCell>
                        <TableCell width={60}>Actions</TableCell>
                        <TableCell width={90}>
                            {renderSortLabel('Heure début', 'startedAt')}
                        </TableCell>
                        {!!resultsQuery.data.examDuration && (
                            <TableCell width={90}>Heure limite</TableCell>
                        )}
                        <TableCell sortDirection={sortDirection}>
                            {renderSortLabel('Adresse e-mail', 'email')}
                        </TableCell>
                        <TableCell sortDirection={sortDirection}>
                            {renderSortLabel('Nom de famille', 'lastName')}
                        </TableCell>
                        <TableCell sortDirection={sortDirection}>
                            {renderSortLabel('Prénom', 'firstName')}
                        </TableCell>
                        <TableCell width={40}>{renderSortLabel('Note', 'mark')}</TableCell>
                        <TableCell width={80}>
                            {renderSortLabel('Statut', 'attemptStatus')}
                        </TableCell>
                        <TableCell width={50}>
                            {renderSortLabel('Durée', 'actualDuration')}
                        </TableCell>
                        <TableCell width={50}>
                            {renderSortLabel("Sorties d'examen", 'roundTrips')}
                        </TableCell>
                        <TableCell width={50}>
                            {renderSortLabel('Temps total hors examen', 'timeSpentOutside')}
                        </TableCell>
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
                                <TableCell>{result.lastName}</TableCell>
                                <TableCell>{result.firstName}</TableCell>
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

    function renderSortLabel(label: string, sortColumn: sortColumnType) {
        return (
            <TableSortLabel
                active={activeSort === sortColumn}
                direction={sortDirection}
                onClick={() => {
                    if (activeSort !== sortColumn) {
                        setActiveSort(sortColumn);
                        setSortDirection('asc');
                    } else {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    }
                }}
            >
                {label}
            </TableSortLabel>
        );
    }

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
                firstName: result.firstName,
                lastName: result.lastName,
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

    function sortData<
        T extends {
            email: string;
            firstName: string;
            lastName: string;
            mark: number;
            startedAt: string;
            actualDuration: string;
            attemptStatus: attemptStatusType;
            roundTrips: number;
            timeSpentOutside: string;
        },
    >(data: Array<T>, activeSort: sortColumnType, sortDirection: 'asc' | 'desc'): Array<T> {
        return data.sort((resultA, resultB) => {
            const result = getCompareValue(activeSort, resultA, resultB);

            if (sortDirection === 'asc') {
                return result;
            } else {
                if (result === 0) {
                    return 0;
                }
                return result > 0 ? -1 : 1;
            }
        });

        function getCompareValue(activeSort: sortColumnType, resultA: T, resultB: T): number {
            switch (activeSort) {
                case 'email':
                    return resultA.email.localeCompare(resultB.email);
                case 'mark':
                    return resultA.mark - resultB.mark;
                case 'startedAt':
                    return (
                        new Date(resultA.startedAt).getTime() -
                        new Date(resultB.startedAt).getTime()
                    );
                case 'firstName':
                    return resultA.firstName.localeCompare(resultB.firstName);
                case 'lastName':
                    return resultA.lastName.localeCompare(resultB.lastName);
                case 'attemptStatus':
                    return (
                        attemptStatusMapping[resultA.attemptStatus] -
                        attemptStatusMapping[resultB.attemptStatus]
                    );
                case 'roundTrips':
                    return resultA.roundTrips - resultB.roundTrips;
                case 'timeSpentOutside':
                    return resultA.timeSpentOutside.localeCompare(resultB.timeSpentOutside);
                case 'actualDuration':
                    return resultA.actualDuration.localeCompare(resultB.actualDuration);
            }
        }
    }
}

const TitleContainer = styled('div')(({ theme }) => ({
    textAlign: 'center',
}));

const TableCellContent = styled('div')({ display: 'flex', alignItems: 'center' });

const MarksContainer = styled('div')({ display: 'flex', flexDirection: 'column' });
const BoldContainer = styled('span')({ fontWeight: 'bolder' });

export { ExamResults };
