import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
    styled,
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Loader } from '../../../components/Loader';
import { StudentsCreationModal } from './StudentsCreationModal';
import { Menu } from '../../../components/Menu';
import { time } from '../../../lib/time';
import { computeAttemptStatusIcon } from '../../../lib/computeAttemptStatusIcon';
import { attemptStatusType } from '../../../types';
import { useParams } from 'react-router-dom';
import { Link } from '../../../components/Link';
import { pathHandler } from '../../../lib/pathHandler';
import { studentsSummaryType } from './types';
import { computeShouldDisplayNameColumns } from './lib/computeShouldDisplayNameColumns';

type sortColumnType = 'email' | 'lastName' | 'createdDate' | string;

function Students() {
    const params = useParams();
    const classeId = params.classeId as string;
    const establishmentId = params.establishmentId as string;
    const [isStudentsCreationModalOpen, setIsStudentsCreationModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const studentsQuery = useQuery<studentsSummaryType>({
        queryKey: ['classes', classeId, 'students'],
        queryFn: () => api.fetchStudents({ classeId }),
    });

    const deleteStudentMutation = useMutation({
        mutationFn: api.deleteStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes', classeId, 'students'] });
        },
    });

    const [activeSort, setActiveSort] = useState<sortColumnType>('email');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    if (!studentsQuery.data) {
        if (studentsQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    const buttons = [
        {
            IconComponent: PersonAddAlt1Icon,
            onClick: () => setIsStudentsCreationModalOpen(true),
            title: 'Ajouter des élèves',
        },
    ];

    const sortedData = sortData(studentsQuery.data.students, activeSort, sortDirection);

    const shouldDisplayNameColumns = computeShouldDisplayNameColumns(studentsQuery.data);
    return (
        <>
            <Menu buttons={buttons} />

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={20}>N°</TableCell>
                        <TableCell width={100}>Actions</TableCell>
                        <TableCell width={200}>
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

                        {shouldDisplayNameColumns && (
                            <TableCell width={150}>
                                <TableSortLabel
                                    active={activeSort === 'lastName'}
                                    direction={sortDirection}
                                    onClick={() => {
                                        if (activeSort !== 'lastName') {
                                            setActiveSort('lastName');
                                        }
                                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                    }}
                                >
                                    Nom
                                </TableSortLabel>
                            </TableCell>
                        )}
                        {shouldDisplayNameColumns && <TableCell width={150}>Prénom</TableCell>}

                        <TableCell>
                            <TableSortLabel
                                active={activeSort === 'createdDate'}
                                direction={sortDirection}
                                onClick={() => {
                                    if (activeSort !== 'createdDate') {
                                        setActiveSort('createdDate');
                                    }
                                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                }}
                            >
                                Date d'ajout
                            </TableSortLabel>
                        </TableCell>
                        {Object.entries(studentsQuery.data.examInfos).map(([examId, examInfo]) => (
                            <TableCell key={'label-' + examId}>
                                <TableSortLabel
                                    active={activeSort === examId}
                                    direction={sortDirection}
                                    onClick={() => {
                                        if (activeSort !== examId) {
                                            setActiveSort(examId);
                                        }
                                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                    }}
                                >
                                    {examInfo.name}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map((student, index) => (
                        <TableRow key={student.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                                <Tooltip title="Supprimer">
                                    <IconButton
                                        onClick={buildDeleteStudent(student.id, student.email)}
                                    >
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>

                            <TableCell>{student.email}</TableCell>
                            {shouldDisplayNameColumns && <TableCell>{student.lastName}</TableCell>}
                            {shouldDisplayNameColumns && <TableCell>{student.firstName}</TableCell>}
                            <TableCell>
                                {time.formatToReadable(new Date(student.createdDate), {
                                    shouldDisplayTime: true,
                                })}
                            </TableCell>
                            {Object.keys(studentsQuery.data.examInfos).map((examId) => {
                                const attemptPath = computePathForAttempt(
                                    examId,
                                    student.examStatus[examId].attemptId,
                                );
                                const displayedMark = `${student.examStatus[examId].mark} /
                                ${studentsQuery.data.examInfos[examId].totalPoints}`;
                                return (
                                    <TableCell key={'examStatus-' + examId}>
                                        <AttemptInfoContainer>
                                            <MarkContainer>
                                                {attemptPath === undefined ? (
                                                    displayedMark
                                                ) : (
                                                    <Link to={attemptPath}>{displayedMark}</Link>
                                                )}
                                            </MarkContainer>
                                            <IconContainer>
                                                {computeAttemptStatusIcon(
                                                    student.examStatus[examId].attemptStatus,
                                                )}
                                            </IconContainer>
                                        </AttemptInfoContainer>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <StudentsCreationModal
                classeId={classeId}
                isOpen={isStudentsCreationModalOpen}
                close={() => setIsStudentsCreationModalOpen(false)}
            />
        </>
    );

    function computePathForAttempt(examId: string, attemptId: string | undefined) {
        if (attemptId === undefined) {
            return undefined;
        }
        return pathHandler.getRoutePath('EXAM_CHECKING', {
            examId,
            attemptId,
            establishmentId,
            classeId,
        });
    }

    function sortData(
        data: studentsSummaryType['students'],
        activeSort: sortColumnType,
        sortDirection: 'asc' | 'desc',
    ) {
        return data.sort((resultA, resultB) => {
            let result = 0;
            switch (activeSort) {
                case 'email':
                    result = resultA.email.localeCompare(resultB.email);
                    break;
                case 'createdDate':
                    result =
                        new Date(resultA.createdDate).getTime() -
                        new Date(resultB.createdDate).getTime();
                    break;
                case 'lastName':
                    result = resultA.lastName.localeCompare(resultB.lastName);
                    break;
                default:
                    result =
                        convertExamStatusToValue(resultA.examStatus[activeSort].attemptStatus) -
                        convertExamStatusToValue(resultB.examStatus[activeSort].attemptStatus);
                    break;
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

    function buildDeleteStudent(studentId: string, studentEmail: string) {
        return () => {
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm(
                `Souhaitez-vous réellement supprimer ${studentEmail} ? Tous ses résultats aux examens seront également supprimés.`,
            );
            if (hasConfirmed) {
                deleteStudentMutation.mutate({ studentId, classeId });
            }
        };
    }
}

function convertExamStatusToValue(status: attemptStatusType): number {
    switch (status) {
        case 'corrected':
            return 3;
        case 'finished':
            return 2;
        case 'expired':
            return 1;
        case 'pending':
            return 0;
        case 'notStarted':
            return -1;
    }
}

const MarkContainer = styled('div')(({ theme }) => ({ marginRight: theme.spacing() }));
const AttemptInfoContainer = styled('div')({ display: 'flex', alignItems: 'center' });
const IconContainer = styled('div')({});

export { Students };
