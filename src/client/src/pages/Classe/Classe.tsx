import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { styled } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Loader } from '../../components/Loader';
import { Menu } from '../../components/Menu';
import { pathHandler } from '../../lib/pathHandler';
import { AdminSideMenu } from '../../components/AdminSideMenu';
import { ExamTable } from '../../components/TeacherPage/ExamTable/ExamTable';
import { establishmentWithClassesType } from '../../lib/api/api';
import { sortedExamsApiType } from './types';
import { ExamCreationModal } from './ExamCreationModal';
import { ClasseHeader } from './ClasseHeader';
import { useStoreCurrentLocation } from '../../lib/useStoreCurrentLocation';

function Classe() {
    useStoreCurrentLocation();

    const params = useParams();

    const establishmentId = params.establishmentId as string;
    const classeId = params.classeId as string;
    const examsQueryKey = computeExamsQueryKey(establishmentId, classeId);
    const examListQuery = useQuery<sortedExamsApiType>({
        queryKey: examsQueryKey,
        queryFn: () => api.fetchExams({ establishmentId, classeId }),
    });
    const establishmentsQuery = useQuery({
        queryKey: ['establishments'],
        queryFn: api.fetchEstablishments,
    });
    const studentsCountQuery = useQuery({
        queryKey: ['classes', classeId, 'studentsCount'],
        queryFn: () => api.countStudentsByClasse(classeId),
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

    return (
        <>
            <ContentContainer>
                <AdminSideMenu establishments={establishmentsQuery.data} />

                <TableContainer>
                    <Menu
                        buttons={[
                            {
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
                            title="À venir"
                            exams={examListQuery.data.toCome}
                            examsQueryKey={examsQueryKey}
                        />
                    )}
                    {examListQuery.data.current.length > 0 && (
                        <ExamTable
                            classeId={classeId}
                            establishmentId={establishmentId}
                            title="En cours"
                            exams={examListQuery.data.current}
                            examsQueryKey={examsQueryKey}
                        />
                    )}
                    {examListQuery.data.past.length > 0 && (
                        <ExamTable
                            classeId={classeId}
                            establishmentId={establishmentId}
                            title="Passés"
                            exams={examListQuery.data.past}
                            examsQueryKey={examsQueryKey}
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
const TableContainer = styled('div')({ width: '50%' });

export { Classe };
