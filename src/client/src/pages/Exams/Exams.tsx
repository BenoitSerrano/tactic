import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ScannerIcon from '@mui/icons-material/Scanner';
import VisibilityIcon from '@mui/icons-material/Visibility';
// import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { config } from '../../config';
import { Loader } from '../../components/Loader';
import { ExamCreationModal } from './ExamCreationModal';
import { Menu } from '../../components/Menu';
import { useAlert } from '../../lib/alert';
import { ExamCreatedModal } from './ExamCreatedModal';
import { examApiType } from './types';
import { pathHandler } from '../../lib/pathHandler';
import { EditableName } from './EditableName';
import { EditableDuration } from './EditableDuration';
import { IconButton } from '../../components/IconButton';

function Exams() {
    const query = useQuery<Array<examApiType>>({ queryKey: ['exams'], queryFn: api.fetchExams });
    const navigate = useNavigate();
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();

    const [isCreateExamModalOpen, setIsCreateExamModalOpen] = useState(false);
    const [isExamCreatedModalOpen, setIsExamCreatedModalOpen] = useState(false);
    const deleteExamMutation = useMutation({
        mutationFn: api.deleteExam,
        onSuccess: () => {
            displayAlert({
                variant: 'success',
                text: `L'examen a bien été supprimé.`,
            });
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: `Une erreur est survenue. L'examen n'a pas pu être supprimé`,
            });
        },
    });
    const duplicateExamMutation = useMutation({
        mutationFn: api.duplicateExam,
        onSuccess: (exam) => {
            displayAlert({
                variant: 'success',
                text: `L'examen "${exam.name}" a bien été dupliqué`,
            });
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. L'examen n'a pas pu être dupliqué",
            });
        },
    });

    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    return (
        <>
            <Menu
                buttons={[
                    {
                        onClick: openCreationModal,
                        IconComponent: PostAddIcon,
                        title: 'Créer un examen',
                    },
                ]}
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={290}>Actions</TableCell>
                        <TableCell>Nom du test</TableCell>
                        <TableCell width={170}>Durée</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {query.data.map((exam) => (
                        <TableRow key={exam.id}>
                            <TableCell>
                                <IconButton
                                    IconComponent={VisibilityIcon}
                                    title="Prévisualiser l'examen"
                                    onClick={buildNavigateToPreview(exam.id)}
                                />
                                {/* <IconButton
                                    title="Accéder à la liste des exercices"
                                    IconComponent={FormatListBulletedIcon}
                                    onClick={buildNavigateToEdition(exam.id)}
                                /> */}
                                <IconButton
                                    title="Éditer l'examen"
                                    IconComponent={EditNoteIcon}
                                    onClick={buildNavigateToExamEdition(exam.id)}
                                />

                                <IconButton
                                    title="Voir les copies des étudiants"
                                    IconComponent={RateReviewIcon}
                                    onClick={buildNavigateToResults(exam.id)}
                                />
                                <IconButton
                                    title="Copier le lien à partager aux étudiants"
                                    onClick={buildCopyExamLinkToClipboard(exam.id)}
                                    IconComponent={ContentCopyIcon}
                                />
                                <IconButton
                                    title="Dupliquer l'examen"
                                    IconComponent={ScannerIcon}
                                    onClick={buildDuplicateExam(exam.id)}
                                />
                                <IconButton
                                    IconComponent={DeleteForeverIcon}
                                    title="Supprimer l'examen"
                                    onClick={buildDeleteExam(exam.id)}
                                />
                            </TableCell>
                            <TableCell>
                                <EditableName exam={exam} />
                            </TableCell>
                            <TableCell>
                                <EditableDuration exam={exam} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <ExamCreationModal
                isOpen={isCreateExamModalOpen}
                onExamCreated={onExamCreated}
                close={() => setIsCreateExamModalOpen(false)}
            />
            <ExamCreatedModal
                isOpen={isExamCreatedModalOpen}
                close={() => setIsExamCreatedModalOpen(false)}
            />
        </>
    );

    function openCreationModal() {
        setIsCreateExamModalOpen(true);
    }

    function onExamCreated() {
        queryClient.invalidateQueries({ queryKey: ['exams'] });
        setIsExamCreatedModalOpen(true);
    }

    function buildNavigateToPreview(examId: string) {
        const path = pathHandler.getRoutePath('EXAM_PREVIEWING', { examId });
        return () => navigate(path);
    }

    // function buildNavigateToEdition(examId: string) {
    //     const path = pathHandler.getRoutePath('EXAM_EXERCISES', { examId });
    //     return () => navigate(path);
    // }

    function buildNavigateToExamEdition(examId: string) {
        const path = pathHandler.getRoutePath('EXAM_EDITING', { examId });
        return () => navigate(path);
    }

    function buildNavigateToResults(examId: string) {
        const path = pathHandler.getRoutePath('EXAM_RESULTS', { examId });
        return () => navigate(path);
    }

    function buildCopyExamLinkToClipboard(examId: string) {
        return () => {
            const path = pathHandler.getRoutePath('STUDENT_AUTHENTICATION', { examId });
            const url = `${config.HOST_URL}${path}`;
            navigator.clipboard.writeText(url);
            displayAlert({
                text: 'Le lien a bien été copié dans le presse-papiers',
                variant: 'success',
            });
        };
    }

    function buildDuplicateExam(examId: string) {
        return () => {
            duplicateExamMutation.mutate({ examId });
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
