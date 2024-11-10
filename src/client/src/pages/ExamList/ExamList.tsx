import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { ListItemIcon, ListItemText, MenuItem, Menu as MuiMenu, styled } from '@mui/material';
import ScannerIcon from '@mui/icons-material/Scanner';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
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
import { ExamTable } from '../../components/TeacherPage/ExamTable/ExamTable';
import { TableHeader } from './TableHeader';
import { establishmentWithClassesType } from '../../lib/api/api';

function ExamList() {
    const params = useParams();

    const establishmentId = params.establishmentId as string | undefined;
    const classeId = params.classeId as string | undefined;
    const examsQueryKey = computeExamsQueryKey(establishmentId, classeId);
    const examListQuery = useQuery<sortedExamsApiType>({
        queryKey: examsQueryKey,
        queryFn: () => api.fetchExams({ establishmentId, classeId }),
    });
    const establishmentsQuery = useQuery({
        queryKey: ['establishments'],
        queryFn: api.fetchEstablishments,
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
            queryClient.invalidateQueries({ queryKey: examsQueryKey });
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
            queryClient.invalidateQueries({ queryKey: examsQueryKey });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. L'examen n'a pas pu être dupliqué",
            });
        },
    });

    if (!examListQuery.data || !establishmentsQuery.data) {
        if (examListQuery.isLoading || establishmentsQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    const titleWithIcon =
        computeTitleWithIcon({
            establishmentId,
            classeId,
            establishmentsWithClasses: establishmentsQuery.data,
        }) || '';

    if (!titleWithIcon) {
        return <Navigate to={pathHandler.getRoutePath('EXAM_LIST_FOR_ALL')} />;
    }

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

                <ImportantMenuItem onClick={buildDeleteExam(currentOptionMenu?.examId)}>
                    <ListItemIcon>
                        <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Supprimer</ListItemText>
                </ImportantMenuItem>
            </MuiMenu>

            <ContentContainer>
                <AdminSideMenu establishments={establishmentsQuery.data} />

                <TableContainer>
                    <PageTitle
                        title={titleWithIcon.title}
                        IconComponent={titleWithIcon.IconComponent}
                    />
                    <Menu
                        buttons={[
                            {
                                onClick: openCreationModal,
                                IconComponent: PostAddIcon,
                                title: 'Créer un examen',
                            },
                        ]}
                    />
                    <TableHeader classeId={classeId} establishmentId={establishmentId} />
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
                classeId={classeId}
                isOpen={isCreateExamModalOpen}
                onExamCreated={onExamCreated}
                close={() => setIsCreateExamModalOpen(false)}
            />
        </>
    );

    function openCreationModal() {
        setIsCreateExamModalOpen(true);
    }

    function onExamCreated(examId: string) {
        queryClient.invalidateQueries({ queryKey: examsQueryKey });
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

function computeTitleWithIcon(params: {
    establishmentId: string | undefined;
    classeId: string | undefined;
    establishmentsWithClasses: Array<establishmentWithClassesType>;
}) {
    if (!params.establishmentId) {
        return { title: 'Tous mes examens' };
    }

    const establishment = params.establishmentsWithClasses.find(
        (establishment) => establishment.id === params.establishmentId,
    );

    if (!establishment) {
        return undefined;
    }

    if (!params.classeId) {
        return {
            title: establishment.name,
            IconComponent: <AccountBalanceOutlinedIcon fontSize="large" />,
        };
    }

    const classe = establishment.classes.find((classe) => classe.id === params.classeId);

    if (!classe) {
        return undefined;
    }

    return {
        title: `${establishment.name} - ${classe.name}`,
        IconComponent: <FolderOutlinedIcon fontSize="large" />,
    };
}

function computeExamsQueryKey(establishmentId: string | undefined, classeId: string | undefined) {
    if (establishmentId === undefined) {
        return ['exams'];
    }
    if (classeId === undefined) {
        return ['establishment', establishmentId, 'exams'];
    }
    return ['establishment', establishmentId, 'classes', classeId, 'exams'];
}

const ContentContainer = styled('div')({ display: 'flex' });
const TableContainer = styled('div')({});
const ImportantMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.error.main,
    '.MuiListItemIcon-root': { color: theme.palette.error.main },
}));

export { ExamList };
