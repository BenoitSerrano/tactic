import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { styled } from '@mui/material';
import { api } from '../../lib/api';
import { Loader } from '../../components/Loader';
import { QuestionsChecking } from './QuestionsChecking';
import { attemptWithAnswersApiType } from './types';

function ExamChecking() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const examId = params.examId as string;
    const attemptWithAnswersQuery = useQuery<attemptWithAnswersApiType>({
        queryKey: ['attempts', attemptId],
        queryFn: () => api.fetchAttemptWithAnswers(attemptId),
    });

    if (!attemptWithAnswersQuery.data) {
        if (attemptWithAnswersQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    return (
        <MainContainer>
            <QuestionsChecking
                onEditAnswers={attemptWithAnswersQuery.refetch}
                studentEmail={attemptWithAnswersQuery.data.studentEmail}
                attemptId={attemptId}
                examId={examId}
                exercises={attemptWithAnswersQuery.data.exam.exercises}
                examName={attemptWithAnswersQuery.data.exam.name}
            />
        </MainContainer>
    );
}

const MainContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
});

export { ExamChecking };
