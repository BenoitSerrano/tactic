import { styled } from '@mui/material';
import { Loader } from '../../../components/Loader';
import { api } from '../../../lib/api';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router-dom';
import { attemptWithAnswersApiType } from '../types';
import { QuestionsConsulting } from './QuestionsConsulting';
import { NotLoggedInPage } from '../../../components/NotLoggedInPage';
import { computePathKeyToNavigateTo } from '../../../lib/computePathKeyToNavigateTo';
import { pathHandler } from '../../../lib/pathHandler';

function ExamConsulting() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const studentId = params.studentId as string;
    const attemptWithAnswersQuery = useQuery<attemptWithAnswersApiType>({
        queryKey: ['attempts', attemptId],
        queryFn: () => api.fetchAttemptWithAnswers({ attemptId }),
    });

    if (!attemptWithAnswersQuery.data) {
        if (attemptWithAnswersQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    const pathKeyToNavigateTo = computePathKeyToNavigateTo(attemptWithAnswersQuery.data, 'consult');

    if (pathKeyToNavigateTo !== 'EXAM_CONSULTING') {
        const pathToNavigateTo = pathHandler.getRoutePath(pathKeyToNavigateTo, {
            studentId,
            attemptId: attemptWithAnswersQuery.data.id || '',
        });
        return <Navigate to={pathToNavigateTo} />;
    }

    return (
        <NotLoggedInPage>
            <MainContainer>
                <QuestionsConsulting
                    studentEmail={attemptWithAnswersQuery.data.studentEmail}
                    attemptId={attemptId}
                    exam={attemptWithAnswersQuery.data.exam}
                />
            </MainContainer>
        </NotLoggedInPage>
    );
}

const MainContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: theme.spacing(3),
}));

export { ExamConsulting };
