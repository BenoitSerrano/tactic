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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Loader } from '../../components/Loader';
import { StudentsCreationModal } from './StudentsCreationModal';
import { Menu } from '../../components/Menu';
import { iconLib } from '../../lib/icons';

type sortColumnType = 'email';

type studentsSummaryType = {
    students: Array<{
        id: string;
        email: string;
        examStatus: Record<string, 'blank' | 'pending' | 'done'>;
    }>;
    examIds: string[];
};

function Students() {
    const [isStudentsCreationModalOpen, setIsStudentsCreationModalOpen] = useState(false);
    const queryClient = useQueryClient();
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

    const buttons = [
        {
            IconComponent: PersonAddAlt1Icon,
            onClick: () => setIsStudentsCreationModalOpen(true),
            title: 'Ajouter un.e ou plusieurs étudiant.es',
        },
    ];

    if (!query.data && query.isLoading) {
        return <Loader />;
    }

    if (!query.data) {
        return <div />;
    }

    const sortedData = sortData(query.data.students, activeSort, sortDirection);

    return (
        <>
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
                        {query.data.examIds.map((examId) => (
                            <TableCell>{examId}</TableCell>
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
            <Menu buttons={buttons} />
        </>
    );

    function sortData<T extends { email: string }>(
        data: Array<T>,
        activeSort: sortColumnType,
        sortDirection: 'asc' | 'desc',
    ) {
        return data.sort((resultA, resultB) => {
            let result = 0;
            switch (activeSort) {
                case 'email':
                    result = resultA.email.localeCompare(resultB.email);
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
                'Souhaitez-vous réellement supprimer cet.te étudiant.e ? Tous ses résultats aux examens seront également supprimés.',
            );
            if (hasConfirmed) {
                deleteStudentMutation.mutate(studentId);
            }
        };
    }
}

export { Students };
