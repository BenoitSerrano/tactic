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
import MoveDownIcon from '@mui/icons-material/MoveDown';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Loader } from '../../../components/Loader';
import { StudentsCreationModal } from './StudentsCreationModal';
import { Menu } from '../../../components/Menu';
import { time } from '../../../lib/time';
import { computeAttemptStatusIcon } from '../../../lib/computeAttemptStatusIcon';
import { attemptStatusType } from '../../../types';
import { useParams } from 'react-router-dom';
import { groupApiType } from '../types';
import { ChangeGroupModal } from './ChangeGroupModal';

type sortColumnType = 'email' | 'createdDate' | string;

type studentsSummaryType = {
    students: Array<{
        id: string;
        email: string;
        createdDate: string;
        examStatus: Record<string, { attemptStatus: attemptStatusType; mark: number }>;
    }>;
    examInfos: Record<string, { name: string; totalPoints: number }>;
};

function Students() {
    const params = useParams();
    const groupId = params.groupId as string;
    const [isStudentsCreationModalOpen, setIsStudentsCreationModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const studentsQuery = useQuery<studentsSummaryType>({
        queryKey: ['groups', groupId, 'students'],
        queryFn: () => api.fetchStudents({ groupId }),
    });

    const groupsQuery = useQuery<groupApiType[]>({
        queryKey: ['groups'],
        queryFn: api.fetchGroups,
    });

    const deleteStudentMutation = useMutation({
        mutationFn: api.deleteStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'students'] });
        },
    });
    const [studentIdToChangeGroup, setStudentIdToChangeGroup] = useState<string | undefined>(
        undefined,
    );
    const [activeSort, setActiveSort] = useState<sortColumnType>('email');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    if (!studentsQuery.data || !groupsQuery.data) {
        if (studentsQuery.isLoading || groupsQuery.isLoading) {
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
    const groupsDifferentFromCurrent = groupsQuery.data.filter((group) => group.id !== groupId);
    return (
        <>
            <Menu buttons={buttons} />
            <ChangeGroupModal
                groupId={groupId}
                studentId={studentIdToChangeGroup}
                isOpen={!!studentIdToChangeGroup}
                groups={groupsDifferentFromCurrent}
                close={closeGroupCreationModal}
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={20}>N°</TableCell>
                        <TableCell width={100}>Actions</TableCell>
                        <TableCell>
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
                        <TableCell width={100}>
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
                                {groupsDifferentFromCurrent.length > 0 && (
                                    <Tooltip title="Changer de groupe">
                                        <IconButton onClick={buildChangeGroupStudent(student.id)}>
                                            <MoveDownIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                <Tooltip title="Supprimer">
                                    <IconButton onClick={buildDeleteStudent(student.id)}>
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                                {time.formatToReadableDatetime(student.createdDate)}
                            </TableCell>
                            {Object.keys(studentsQuery.data.examInfos).map((examId) => (
                                <TableCell key={'examStatus-' + examId}>
                                    <AttemptInfoContainer>
                                        <MarkContainer>
                                            {student.examStatus[examId].mark} /{' '}
                                            {studentsQuery.data.examInfos[examId].totalPoints}{' '}
                                        </MarkContainer>
                                        <IconContainer>
                                            {computeAttemptStatusIcon(
                                                student.examStatus[examId].attemptStatus,
                                            )}
                                        </IconContainer>
                                    </AttemptInfoContainer>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <StudentsCreationModal
                groupId={groupId}
                isOpen={isStudentsCreationModalOpen}
                close={() => setIsStudentsCreationModalOpen(false)}
            />
        </>
    );

    function buildChangeGroupStudent(studentId: string) {
        return () => {
            setStudentIdToChangeGroup(studentId);
        };
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

    function buildDeleteStudent(studentId: string) {
        return () => {
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm(
                'Souhaitez-vous réellement supprimer cet élève ? Tous ses résultats aux tests seront également supprimés.',
            );
            if (hasConfirmed) {
                deleteStudentMutation.mutate({ studentId, groupId });
            }
        };
    }

    function closeGroupCreationModal() {
        setStudentIdToChangeGroup(undefined);
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
