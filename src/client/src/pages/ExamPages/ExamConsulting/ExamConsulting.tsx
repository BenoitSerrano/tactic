import { styled } from '@mui/material';
import { Loader } from '../../../components/Loader';
import { api } from '../../../lib/api';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { attemptWithAnswersApiType } from '../types';
import { QuestionsConsulting } from './QuestionsConsulting';
import { NotLoggedInPage } from '../../../components/NotLoggedInPage';

function ExamConsulting() {
    const params = useParams();
    const attemptId = params.attemptId as string;
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

    return (
        <NotLoggedInPage>
            <MainContainer>
                <QuestionsConsulting
                    studentEmail={attemptWithAnswersQuery.data.studentEmail}
                    attemptId={attemptId}
                    exercises={attemptWithAnswersQuery.data.exam.exercises}
                    examName={attemptWithAnswersQuery.data.exam.name}
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
