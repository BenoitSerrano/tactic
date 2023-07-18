import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { authentication } from '../../lib/authentication';
import { config } from '../../config';
import { Loader } from '../../components/Loader';
import { ExamCreationModal } from './ExamCreationModal';
import { Menu } from '../../components/Menu';
import { useAlert } from '../../lib/alert';

function Exams() {
    const query = useQuery({ queryKey: ['exams'], queryFn: api.fetchExams });
    const navigate = useNavigate();
    const { displayAlert } = useAlert();
    const [isExamCreationModalOpen, setIsExamCreationModalOpen] = useState(false);

    return (
        <>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell width={150}>Actions</TableCell>
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
                onExamCreated={(examId: string) =>
                    navigate(`/teacher/${authentication.getEncodedPassword()}/exams/${examId}/edit`)
                }
            />
            <Menu
                buttons={[
                    { onClick: () => setIsExamCreationModalOpen(true), IconComponent: PostAddIcon },
                ]}
            />
        </>
    );

    function buildNavigateToEdition(examId: string) {
        return () =>
            navigate(`/teacher/${authentication.getEncodedPassword()}/exams/${examId}/edit`);
    }

    function buildNavigateToResults(examId: string) {
        return () =>
            navigate(`/teacher/${authentication.getEncodedPassword()}/exams/${examId}/results`);
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
}

export { Exams };
