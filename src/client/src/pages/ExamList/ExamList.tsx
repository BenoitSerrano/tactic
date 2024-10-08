import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    Menu as MuiMenu,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    styled,
} from '@mui/material';
import ScannerIcon from '@mui/icons-material/Scanner';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Loader } from '../../components/Loader';
import { ExamCreationModal } from './ExamCreationModal';
import { Menu } from '../../components/Menu';
import { useAlert } from '../../lib/alert';
import { examApiType } from './types';
import { pathHandler } from '../../lib/pathHandler';
import { EditableName } from './EditableName';
import { EditableDuration } from './EditableDuration';
import { IconButton } from '../../components/IconButton';
import { AdminSideMenu } from '../../components/AdminSideMenu';
import { PageTitle } from '../../components/PageTitle';
import { examFilterType } from '../../types';

function ExamList(props: { filter: examFilterType }) {
    const examListQuery = useQuery<Array<examApiType>>({
        queryKey: [`exams-${props.filter}`],
        queryFn: () => api.fetchExams(props.filter),
    });
    const navigate = useNavigate();
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();

    const [currentOptionMenu, setCurrentOptionMenu] = useState<{
        element: HTMLElement;
        examId: string;
    } | null>(null);

    const [isCreateExamModalOpen, setIsCreateExamModalOpen] = useState(false);
    const deleteExamMutation = useMutation({
        mutationFn: api.deleteExam,
        onSuccess: () => {
            displayAlert({
                variant: 'success',
                text: `L'examen a bien été supprimé.`,
            });
            queryClient.invalidateQueries({ queryKey: [`exams-${props.filter}`] });
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: `Une erreur est survenue. L'examen n'a pas pu être supprimé`,
            });
        },
    });
    const archiveExamMutation = useMutation({
        mutationFn: api.archiveExam,
        onSuccess: () => {
            displayAlert({
                variant: 'success',
                text: `L'examen a bien été archivé.`,
            });
            queryClient.invalidateQueries({ queryKey: ['exams-current'] });
            queryClient.invalidateQueries({ queryKey: ['exams-archived'] });
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: `Une erreur est survenue. L'examen n'a pas pu être archivé`,
            });
        },
    });
    const unarchiveExamMutation = useMutation({
        mutationFn: api.unarchiveExam,
        onSuccess: () => {
            displayAlert({
                variant: 'success',
                text: `L'examen a bien été désarchivé.`,
            });
            queryClient.invalidateQueries({ queryKey: ['exams-current'] });
            queryClient.invalidateQueries({ queryKey: ['exams-archived'] });
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: `Une erreur est survenue. L'examen n'a pas pu être désarchivé`,
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
            queryClient.invalidateQueries({ queryKey: [`exams-${props.filter}`] });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. L'examen n'a pas pu être dupliqué",
            });
        },
    });

    if (!examListQuery.data) {
        if (examListQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    const title = computeTitle(props.filter);

    return (
        <>
            <MuiMenu
                anchorEl={currentOptionMenu?.element}
                open={!!currentOptionMenu}
                onClose={closeEditionMenu}
            >
                <MenuItem onClick={buildDuplicateExam(currentOptionMenu?.examId)}>
                    <ListItemIcon>
                        <ScannerIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Dupliquer</ListItemText>
                </MenuItem>
                <MenuItem onClick={buildArchiveExamAction(currentOptionMenu?.examId)}>
                    {renderArchiveListItem()}
                </MenuItem>
                <ImportantMenuItem onClick={buildDeleteExam(currentOptionMenu?.examId)}>
                    <ListItemIcon>
                        <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Supprimer</ListItemText>
                </ImportantMenuItem>
            </MuiMenu>

            <ContentContainer>
                <AdminSideMenu />

                <TableContainer>
                    <PageTitle title={title} />
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
                                <TableCell width={10}></TableCell>
                                <TableCell>Nom de l'examen</TableCell>
                                <TableCell width={170}>Durée</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {examListQuery.data.map((exam) => (
                                <ClickableTableRow
                                    hover
                                    key={exam.id}
                                    onClick={handleRowClick(exam.id)}
                                >
                                    <TableCell>
                                        <IconButton
                                            title="Actions"
                                            IconComponent={MoreHorizIcon}
                                            onClick={buildOpenOptionMenu(exam.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <EditableName exam={exam} />
                                    </TableCell>
                                    <TableCell>
                                        <EditableDuration exam={exam} />
                                    </TableCell>
                                </ClickableTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ContentContainer>

            <ExamCreationModal
                isOpen={isCreateExamModalOpen}
                onExamCreated={onExamCreated}
                close={() => setIsCreateExamModalOpen(false)}
            />
        </>
    );

    function handleRowClick(examId: string) {
        return () => {
            const path = pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId });
            navigate(path);
        };
    }

    function renderArchiveListItem() {
        switch (props.filter) {
            case 'current':
                return [
                    <ListItemIcon key="archive-filter-icon">
                        <ArchiveIcon fontSize="small" />
                    </ListItemIcon>,
                    <ListItemText key="archive-filter-text">Archiver</ListItemText>,
                ];
            case 'archived':
                return [
                    <ListItemIcon key="unarchive-filter-icon">
                        <UnarchiveIcon fontSize="small" />
                    </ListItemIcon>,
                    <ListItemText key="unarchive-filter-text">Désarchiver</ListItemText>,
                ];
        }
    }

    function openCreationModal() {
        setIsCreateExamModalOpen(true);
    }

    function computeTitle(filter: examFilterType) {
        switch (filter) {
            case 'current':
                return 'Mes examens en cours';
            case 'archived':
                return 'Mes examens archivés';
        }
    }

    function buildOpenOptionMenu(examId: string) {
        return (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();

            setCurrentOptionMenu({ element: event.currentTarget, examId });
        };
    }

    function onExamCreated(examId: string) {
        queryClient.invalidateQueries({ queryKey: [`exams-${props.filter}`] });
        const path = pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId });

        navigate(path);
    }

    function closeEditionMenu() {
        setCurrentOptionMenu(null);
    }

    function buildDuplicateExam(examId: string | undefined) {
        return () => {
            if (!examId) {
                return;
            }
            closeEditionMenu();
            duplicateExamMutation.mutate({ examId });
        };
    }

    function buildArchiveExamAction(examId: string | undefined) {
        return () => {
            if (!examId) {
                return;
            }
            closeEditionMenu();
            switch (props.filter) {
                case 'archived':
                    unarchiveExamMutation.mutate(examId);
                    break;
                case 'current':
                    // eslint-disable-next-line no-restricted-globals
                    const hasConfirmed = confirm(
                        "Souhaitez-vous réellement archiver cet examen ? Les étudiant·es n'y auront plus accès.",
                    );
                    if (hasConfirmed) {
                        archiveExamMutation.mutate(examId);
                    }
            }
        };
    }

    function buildDeleteExam(examId: string | undefined) {
        return () => {
            if (!examId) {
                return;
            }
            closeEditionMenu();
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm(
                'Souhaitez-vous réellement supprimer cet examen ? Tous les résultats liés à cet examen seront supprimés.',
            );
            if (hasConfirmed) {
                deleteExamMutation.mutate(examId);
            }
        };
    }
}

const ContentContainer = styled('div')({ display: 'flex' });
const TableContainer = styled('div')({});
const ImportantMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.error.main,
    '.MuiListItemIcon-root': { color: theme.palette.error.main },
}));
const ClickableTableRow = styled(TableRow)({ cursor: 'pointer' });

export { ExamList };
