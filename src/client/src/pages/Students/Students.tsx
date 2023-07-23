import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Loader } from '../../components/Loader';
import { StudentCreationModal } from './StudentCreationModal';
import { StudentsCreationModal } from './StudentsCreationModal';
import { Menu } from '../../components/Menu';

function Students() {
    const [isStudentCreationModalOpen, setIsStudentCreationModalOpen] = useState(false);
    const [isStudentsCreationModalOpen, setIsStudentsCreationModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const query = useQuery({ queryKey: ['students'], queryFn: api.fetchStudents });

    const deleteStudentMutation = useMutation({
        mutationFn: api.deleteStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });

    const buttons = [
        {
            IconComponent: PersonAddAlt1Icon,
            onClick: () => setIsStudentCreationModalOpen(true),
            title: 'Ajouter un.e étudiant.e',
        },
        {
            IconComponent: PlaylistAddIcon,
            onClick: () => setIsStudentsCreationModalOpen(true),
            title: 'Ajouter plusieurs étudiant.es',
        },
    ];

    if (!query.data && query.isLoading) {
        return <Loader />;
    }

    return (
        <>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Adresse e-mail</TableCell>
                        <TableCell>Commentaire</TableCell>
                        <TableCell width={100}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {query.data?.map((student: any) => (
                        <TableRow key={student.id}>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.comment}</TableCell>
                            <TableCell>
                                <IconButton
                                    title="Supprimer"
                                    onClick={buildDeleteStudent(student.id)}
                                >
                                    <DeleteForeverIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <StudentCreationModal
                isOpen={isStudentCreationModalOpen}
                close={() => setIsStudentCreationModalOpen(false)}
            />
            <StudentsCreationModal
                isOpen={isStudentsCreationModalOpen}
                close={() => setIsStudentsCreationModalOpen(false)}
            />
            <Menu buttons={buttons} />
        </>
    );

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
