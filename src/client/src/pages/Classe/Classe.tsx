import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Loader } from '../../components/Loader';
import { Menu } from '../../components/Menu';
import { pathHandler } from '../../lib/pathHandler';
import { AdminSideMenu } from '../../components/AdminSideMenu';
import { ExamTable } from '../../components/TeacherPage/ExamTable/ExamTable';
import { sortedExamsApiType } from './types';
import { ExamCreationModal } from './ExamCreationModal';
import { ClasseHeader } from './ClasseHeader';
import { examsApi } from '../../lib/api/examsApi';
import { studentsApi } from '../../lib/api/studentsApi';
import { establishmentsApi, establishmentWithClassesType } from '../../lib/api/establishmentsApi';
import { localStorage } from '../../lib/localStorage';

function Classe() {
    const params = useParams();

    const establishmentId = params.establishmentId as string;
    const classeId = params.classeId as string;
    const examsQueryKey = ['establishments', establishmentId, 'classes', classeId, 'exams'];
    const examListQuery = useQuery<sortedExamsApiType>({
        queryKey: examsQueryKey,
        queryFn: () => examsApi.getExamsByClasse({ establishmentId, classeId }),
    });
    const establishmentsQuery = useQuery({
        queryKey: ['establishments', 'with-classes'],
        queryFn: establishmentsApi.getEstablishmentsWithClasses,
    });
    const studentsCountQuery = useQuery({
        queryKey: ['classes', classeId, 'students-count'],
        queryFn: () => studentsApi.countStudentsByClasse(classeId),
    });

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const [isCreateExamModalOpen, setIsCreateExamModalOpen] = useState(false);

    if (!examListQuery.data || !establishmentsQuery.data || !studentsCountQuery.data) {
        if (
            examListQuery.isLoading ||
            establishmentsQuery.isLoading ||
            studentsCountQuery.isLoading
        ) {
            return <Loader />;
        }
        return <div />;
    }

    const headerInfo = computeHeaderInfo({
        establishmentId,
        classeId,
        establishmentsWithClasses: establishmentsQuery.data,
    });

    if (!headerInfo) {
        return <Navigate to={pathHandler.getRoutePath('TEACHER_HOME')} />;
    }
    const { classe, establishment } = headerInfo;
    const createExamDisableInfo = computeCreateExamDisableInfo(
        studentsCountQuery.data.studentsCount,
    );

    return (
        <>
            <ContentContainer>
                <AdminSideMenu establishments={establishmentsQuery.data} />

                <TableContainer>
                    <Menu
                        buttons={[
                            {
                                isDisabled: createExamDisableInfo.isDisabled,
                                titleWhenDisabled: createExamDisableInfo.titleWhenDisabled,
                                onClick: openCreationModal,
                                IconComponent: PostAddIcon,
                                title: 'Créer un examen',
                            },
                        ]}
                    />
                    <ClasseHeader
                        studentsCount={studentsCountQuery.data.studentsCount}
                        classe={classe}
                        establishment={establishment}
                    />
                    {examListQuery.data.toCome.length > 0 && (
                        <ExamTable
                            classeId={classeId}
                            establishmentId={establishmentId}
                            title="Examens à venir"
                            exams={examListQuery.data.toCome}
                        />
                    )}
                    {examListQuery.data.current.length > 0 && (
                        <ExamTable
                            classeId={classeId}
                            establishmentId={establishmentId}
                            title="Examens en cours"
                            exams={examListQuery.data.current}
                        />
                    )}
                    {examListQuery.data.past.length > 0 && (
                        <ExamTable
                            classeId={classeId}
                            establishmentId={establishmentId}
                            title="Examens passés"
                            exams={examListQuery.data.past}
                        />
                    )}
                </TableContainer>
            </ContentContainer>

            <ExamCreationModal
                establishmentId={establishmentId}
                classe={classe}
                isOpen={isCreateExamModalOpen}
                onExamCreated={onExamCreated}
                close={() => setIsCreateExamModalOpen(false)}
            />
        </>
    );

    function computeCreateExamDisableInfo(studentsCount: number): {
        isDisabled: boolean;
        titleWhenDisabled?: string;
    } {
        const remainingPapers = localStorage.userInfoHandler.get()?.remainingPapers;
        if (remainingPapers === undefined) {
            return {
                isDisabled: true,
                titleWhenDisabled:
                    "Le nombre de copies restantes sur votre compte n'a pas pu être récupéré, vous ne pouvez donc pas encore créer d'examen pour cette classe. Veuillez recharger la page.",
            };
        }
        if (remainingPapers < studentsCount) {
            return {
                isDisabled: true,
                titleWhenDisabled: `Vous n'avez pas suffisamment de copies restantes (${remainingPapers}) sur votre compte pour créer un examen pour cette classe (${studentsCount} élèves). Vous pouvez acheter un lot de copie sur votre profil.`,
            };
        }
        return { isDisabled: false };
    }

    function openCreationModal() {
        setIsCreateExamModalOpen(true);
    }

    function onExamCreated(examId: string) {
        queryClient.invalidateQueries({ queryKey: examsQueryKey });
        const path = pathHandler.getRoutePath('EXAM_EDITING_CONTENT', {
            examId,
            classeId,
            establishmentId,
        });

        navigate(path);
    }
}

function computeHeaderInfo(params: {
    establishmentId: string;
    classeId: string;
    establishmentsWithClasses: Array<establishmentWithClassesType>;
}) {
    const establishment = params.establishmentsWithClasses.find(
        (establishment) => establishment.id === params.establishmentId,
    );

    if (!establishment) {
        return undefined;
    }

    const classe = establishment.classes.find((classe) => classe.id === params.classeId);

    if (!classe) {
        return undefined;
    }

    return { establishment: { id: establishment.id, name: establishment.name }, classe };
}

const ContentContainer = styled('div')({ display: 'flex' });
const TableContainer = styled('div')({ width: '65%' });

export { Classe };
