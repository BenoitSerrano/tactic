import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material';
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
import { ExamCreatedModal } from './ExamCreatedModal';

function Exams() {
    const query = useQuery({ queryKey: ['exams'], queryFn: api.fetchExams });
    const navigate = useNavigate();
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const [isExamCreationModalOpen, setIsExamCreationModalOpen] = useState(false);
    const [isExamCreatedModalOpen, setIsExamCreatedModalOpen] = useState(false);
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
                        title: 'Créer',
                    },
                ]}
            />
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell width={170}>Actions</TableCell>
                        <TableCell>Nom du test</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {query.data?.map((exam: any) => (
                        <TableRow key={exam.id}>
                            <TableCell>
                                <Tooltip title="Editer">
                                    <IconButton onClick={buildNavigateToEdition(exam.id)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Voir les copies des étudiants">
                                    <IconButton onClick={buildNavigateToResults(exam.id)}>
                                        <RateReviewIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Copier le lien à partager aux étudiants">
                                    <IconButton onClick={buildCopyExamLinkToClipboard(exam.id)}>
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer le test">
                                    <IconButton onClick={buildDeleteExam(exam.id)}>
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </Tooltip>
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
                onExamCreated={() => setIsExamCreatedModalOpen(true)}
            />
            <ExamCreatedModal
                isOpen={isExamCreatedModalOpen}
                close={() => setIsExamCreatedModalOpen(false)}
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
                'Souhaitez-vous réellement supprimer ce test ? Tous les résultats liés à ce test seront supprimés.',
            );
            if (hasConfirmed) {
                deleteExamMutation.mutate(examId);
            }
        };
    }
}

export { Exams };
