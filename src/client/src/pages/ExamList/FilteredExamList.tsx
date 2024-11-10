import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { ListItemIcon, ListItemText, MenuItem, Menu as MuiMenu, styled } from '@mui/material';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import ScannerIcon from '@mui/icons-material/Scanner';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Loader } from '../../components/Loader';
import { ExamCreationModal } from './ExamCreationModal';
import { Menu } from '../../components/Menu';
import { useAlert } from '../../lib/alert';
import { sortedExamsApiType } from './types';
import { pathHandler } from '../../lib/pathHandler';
import { AdminSideMenu } from '../../components/AdminSideMenu';
import { PageTitle } from '../../components/PageTitle';
import { examFilterType } from '../../types';
import { ChangeClasseForExamModal } from './ChangeClasseForExamModal';
import { ExamTable } from './ExamTable';

function FilteredExamList(props: { filter: examFilterType }) {
    const params = useParams();

    const establishmentId = params.establishmentId as string;
    const examListQuery = useQuery<sortedExamsApiType>({
        queryKey: ['establishments', establishmentId, `exams-${props.filter}`],
        queryFn: () => api.fetchExams({ establishmentId, filter: props.filter }),
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

    const [currentExamIdToChange, setCurrentExamIdToChange] = useState<string | undefined>(
        undefined,
    );

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

                <MenuItem onClick={buildChangeClasseForExam(currentOptionMenu?.examId)}>
                    <ListItemIcon>
                        <ChangeCircleOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Changer de classe</ListItemText>
                </MenuItem>
                <ImportantMenuItem onClick={buildDeleteExam(currentOptionMenu?.examId)}>
                    <ListItemIcon>
                        <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Supprimer</ListItemText>
                </ImportantMenuItem>
            </MuiMenu>
            <ChangeClasseForExamModal
                close={closeChangeEstablishmentModal}
                establishmentId={establishmentId}
                examId={currentExamIdToChange}
            />
            <ContentContainer>
                <AdminSideMenu currentEstablishmentId={establishmentId} />

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
                    {examListQuery.data.toCome.length > 0 && (
                        <ExamTable
                            title="À venir"
                            exams={examListQuery.data.toCome}
                            setCurrentOptionMenu={setCurrentOptionMenu}
                        />
                    )}
                    {examListQuery.data.current.length > 0 && (
                        <ExamTable
                            title="En cours"
                            exams={examListQuery.data.current}
                            setCurrentOptionMenu={setCurrentOptionMenu}
                        />
                    )}
                    {examListQuery.data.past.length > 0 && (
                        <ExamTable
                            title="Passés"
                            exams={examListQuery.data.past}
                            setCurrentOptionMenu={setCurrentOptionMenu}
                        />
                    )}
                </TableContainer>
            </ContentContainer>

            <ExamCreationModal
                establishmentId={establishmentId}
                isOpen={isCreateExamModalOpen}
                onExamCreated={onExamCreated}
                close={() => setIsCreateExamModalOpen(false)}
            />
        </>
    );

    function openCreationModal() {
        setIsCreateExamModalOpen(true);
    }

    function closeChangeEstablishmentModal() {
        setCurrentExamIdToChange(undefined);
    }

    function computeTitle(filter: examFilterType): string {
        switch (filter) {
            case 'all':
                return 'Tous mes examens';
        }
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

    function buildChangeClasseForExam(examId: string | undefined) {
        return () => {
            if (!examId) {
                return;
            }
            closeEditionMenu();
            setCurrentExamIdToChange(examId);
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

export { FilteredExamList };
