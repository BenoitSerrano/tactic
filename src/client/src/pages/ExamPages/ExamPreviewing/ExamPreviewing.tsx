import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { styled } from '@mui/material';
import { Loader } from '../../../components/Loader';
import { api } from '../../../lib/api';
import { QuestionsPreviewing } from './QuestionsPreviewing';
import { examWithoutAnswersType } from '../types';
import { NotLoggedInPage } from '../../../components/NotLoggedInPage';

function ExamPreviewing() {
    const params = useParams();
    const examId = params.examId as string;
    const query = useQuery<examWithoutAnswersType>({
        queryKey: ['exam-without-answers', examId],
        queryFn: () => api.fetchExamWithoutAnswers(examId),
    });

    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    return (
        <NotLoggedInPage>
            <MainContainer>
                <QuestionsPreviewing
                    title={query.data.name}
                    exercises={query.data.exercises}
                    examId={examId}
                />
            </MainContainer>
        </NotLoggedInPage>
    );
}

const MainContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
});

export { ExamPreviewing };
