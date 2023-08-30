import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { config } from '../../config';
import { Loader } from '../../components/Loader';
import { ExamCreationModal } from './ExamCreationModal';
import { Menu } from '../../components/Menu';
import { useAlert } from '../../lib/alert';

function Exams() {
    const query = useQuery({ queryKey: ['exams'], queryFn: api.fetchExams });
    const navigate = useNavigate();
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const [isExamCreationModalOpen, setIsExamCreationModalOpen] = useState(false);
    const deleteExamMutation = useMutation({
        mutationFn: api.deleteExam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });

    return (
        <>
            <Menu
                buttons={[
                    {
                        onClick: () => setIsExamCreationModalOpen(true),
                        IconComponent: PostAddIcon,
                    },
                ]}
            />
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell width={170}>Actions</TableCell>
                        <TableCell>Nom de l'examen</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {query.data?.map((exam: any) => (
                        <TableRow key={exam.id}>
                            <TableCell>
                                <IconButton
                                    title="Editer"
                                    onClick={buildNavigateToEdition(exam.id)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    title="Voir les copies des étudiant.es"
                                    onClick={buildNavigateToResults(exam.id)}
                                >
                                    <RateReviewIcon />
                                </IconButton>
                                <IconButton
                                    title="Copier le lien à partager aux étudiant.es"
                                    onClick={buildCopyExamLinkToClipboard(exam.id)}
                                >
                                    <ContentCopyIcon />
                                </IconButton>
                                <IconButton
                                    title="Supprimer l'examen"
                                    onClick={buildDeleteExam(exam.id)}
                                >
                                    <DeleteForeverIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell>{exam.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {!query.data && !!query.isLoading && <Loader />}
            <ExamCreationModal
                isOpen={isExamCreationModalOpen}
                close={() => setIsExamCreationModalOpen(false)}
                onExamCreated={(examId: string) => navigate(`/teacher/exams/${examId}/edit`)}
            />
        </>
    );

    function buildNavigateToEdition(examId: string) {
        return () => navigate(`/teacher/exams/${examId}/edit`);
    }

    function buildNavigateToResults(examId: string) {
        return () => navigate(`/teacher/exams/${examId}/results`);
    }

    function buildCopyExamLinkToClipboard(examId: string) {
        return () => {
            const url = `${config.HOST_URL}/student/exams/${examId}`;
            navigator.clipboard.writeText(url);
            displayAlert({
                text: 'Le lien a bien été copié dans le presse-papiers',
                variant: 'success',
            });
        };
    }

    function buildDeleteExam(examId: string) {
        return () => {
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm(
                'Souhaitez-vous réellement supprimer cet.te étudiant.e ? Tous ses résultats aux examens seront également supprimés.',
            );
            if (hasConfirmed) {
                deleteExamMutation.mutate(examId);
            }
        };
    }
}

export { Exams };
