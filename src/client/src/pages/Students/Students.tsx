import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Loader } from '../../components/Loader';
import { StudentsCreationModal } from './StudentsCreationModal';
import { Menu } from '../../components/Menu';
import { iconLib } from '../../lib/icons';
import { useAlert } from '../../lib/alert';
import { time } from '../../lib/time';

type sortColumnType = 'email' | 'createdDate' | string;
type examStatusType = 'blank' | 'pending' | 'done';

type studentsSummaryType = {
    students: Array<{
        id: string;
        email: string;
        createdDate: number;
        examStatus: Record<string, examStatusType>;
    }>;
    examIds: string[];
};

function Students() {
    const [isStudentsCreationModalOpen, setIsStudentsCreationModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();

    const query = useQuery<studentsSummaryType>({
        queryKey: ['students'],
        queryFn: api.fetchStudents,
    });

    const deleteStudentMutation = useMutation({
        mutationFn: api.deleteStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });
    const [activeSort, setActiveSort] = useState<sortColumnType>('email');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    if (!query.data && query.isLoading) {
        return <Loader />;
    }

    if (!query.data) {
        return <div />;
    }

    const buttons = [
        {
            IconComponent: PersonAddAlt1Icon,
            onClick: () => setIsStudentsCreationModalOpen(true),
            title: 'Ajouter un ou plusieurs étudiants',
        },
        {
            IconComponent: ContentCopyIcon,
            onClick: () => copyStudentsEmailsWithoutAttemptsToClipboard(query.data),
            title: "Copier les adresses e-mails des étudiants n'ayant pas passé l'examen",
        },
    ];

    const sortedData = sortData(query.data.students, activeSort, sortDirection);

    return (
        <>
            <Menu buttons={buttons} />
            <Table stickyHeader>
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
                        {query.data.examIds.map((examId) => (
                            <TableCell>
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
                                    {examId}
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
                                <IconButton
                                    title="Supprimer"
                                    onClick={buildDeleteStudent(student.id)}
                                >
                                    <DeleteForeverIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                                {time.formatToReadableDatetime(student.createdDate)}
                            </TableCell>
                            {query.data.examIds.map((examId) => (
                                <TableCell>
                                    {iconLib.computeIconColor(student.examStatus[examId])}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <StudentsCreationModal
                isOpen={isStudentsCreationModalOpen}
                close={() => setIsStudentsCreationModalOpen(false)}
            />
        </>
    );

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
                    result = resultA.createdDate - resultB.createdDate;
                    break;
                default:
                    result =
                        convertExamStatusToValue(resultA.examStatus[activeSort]) -
                        convertExamStatusToValue(resultB.examStatus[activeSort]);
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

    function copyStudentsEmailsWithoutAttemptsToClipboard(studentsSummary: studentsSummaryType) {
        const emails = studentsSummary.students
            .filter((student) =>
                studentsSummary.examIds.every((examId) => student.examStatus[examId] === 'blank'),
            )
            .map((student) => student.email);
        navigator.clipboard.writeText(emails.join(', '));
        displayAlert({
            text: "Les e-mails d'étudiants n'ayant passé aucun examen a été copiée dans le presse-papiers",
            variant: 'success',
        });
    }

    function buildDeleteStudent(studentId: string) {
        return () => {
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm(
                'Souhaitez-vous réellement supprimer cet étudiant ? Tous ses résultats aux examens seront également supprimés.',
            );
            if (hasConfirmed) {
                deleteStudentMutation.mutate(studentId);
            }
        };
    }
}

function convertExamStatusToValue(status: examStatusType): number {
    switch (status) {
        case 'done':
            return 1;
        case 'pending':
            return 0;
        case 'blank':
            return -1;
    }
}

export { Students };
