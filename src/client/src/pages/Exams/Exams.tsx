import { useState } from 'react';
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
import ScannerIcon from '@mui/icons-material/Scanner';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { config } from '../../config';
import { Loader } from '../../components/Loader';
import { ExamUpsertionModal } from './ExamUpsertionModal';
import { Menu } from '../../components/Menu';
import { useAlert } from '../../lib/alert';
import { ExamCreatedModal } from './ExamCreatedModal';
import { examApiType, modalStatusType } from './types';
import { time } from '../../lib/time';
import { pathHandler } from '../../lib/pathHandler';

function Exams() {
    const query = useQuery<Array<examApiType>>({ queryKey: ['exams'], queryFn: api.fetchExams });
    const navigate = useNavigate();
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const [currentExamModalStatus, setCurrentExamModalStatus] = useState<
        modalStatusType | undefined
    >();
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
                        <TableCell>Durée</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {query.data?.map((exam) => (
                        <TableRow key={exam.id}>
                            <TableCell>
                                <Tooltip title="Prévisualiser l'examen">
                                    <IconButton onClick={buildNavigateToPreview(exam.id)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Accéder à la liste des exercices">
                                    <IconButton onClick={buildNavigateToEdition(exam.id)}>
                                        <FormatListBulletedIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Modifier le test">
                                    <IconButton onClick={buildEditExam(exam)}>
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
                                <Tooltip title="Dupliquer l'examen">
                                    <IconButton onClick={() => {}}>
                                        <ScannerIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer l'examen">
                                    <IconButton onClick={buildDeleteExam(exam.id)}>
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{exam.name}</TableCell>
                            <TableCell>{time.formatToClock(exam.duration * 60)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {!query.data && !!query.isLoading && <Loader />}
            {!!currentExamModalStatus && (
                <ExamUpsertionModal
                    modalStatus={currentExamModalStatus}
                    close={() => setCurrentExamModalStatus(undefined)}
                />
            )}
            <ExamCreatedModal
                isOpen={isExamCreatedModalOpen}
                close={() => setIsExamCreatedModalOpen(false)}
            />
        </>
    );

    function openCreationModal() {
        setCurrentExamModalStatus({ kind: 'creating', onExamCreated });
    }

    function onExamCreated() {
        queryClient.invalidateQueries({ queryKey: ['exams'] });
        setIsExamCreatedModalOpen(true);
    }

    function buildNavigateToPreview(examId: string) {
        const path = pathHandler.getRoutePath('EXAM_PREVIEWING', { examId });
        return () => navigate(path);
    }

    function buildNavigateToEdition(examId: string) {
        const path = pathHandler.getRoutePath('EXAM_EXERCISES', { examId });
        return () => navigate(path);
    }

    function buildEditExam(exam: examApiType) {
        return () => {
            setCurrentExamModalStatus({ kind: 'editing', exam });
        };
    }

    function buildNavigateToResults(examId: string) {
        const path = pathHandler.getRoutePath('EXAM_RESULTS', { examId });

        return () => navigate(path);
    }

    function buildCopyExamLinkToClipboard(examId: string) {
        return () => {
            const url = `${config.HOST_URL}/student/exams/${examId}?action=take`;
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
