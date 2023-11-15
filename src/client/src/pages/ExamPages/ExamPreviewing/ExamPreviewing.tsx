import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { styled } from '@mui/material';
import { NotLoggedInPage } from '../../../components/NotLoggedInPage';
import { Loader } from '../../../components/Loader';
import { api } from '../../../lib/api';
import { QuestionsPreviewing } from './QuestionsPreviewing';
import { examWithoutAnswersType } from '../types';

function ExamPreviewing() {
    const params = useParams();
    const examId = params.examId as string;
    const query = useQuery<examWithoutAnswersType>({
        queryKey: ['exam-without-answers', examId],
        queryFn: () => api.fetchExamWithoutAnswers(examId),
    });

    if (!query.data) {
        return (
            <NotLoggedInPage>
                <Loader />
            </NotLoggedInPage>
        );
    }

    return (
        <NotLoggedInPage>
            <ExamPageContainer>
                <QuestionsPreviewing
                    title={query.data.name}
                    exercises={query.data.exercises}
                    examId={examId}
                />
            </ExamPageContainer>
        </NotLoggedInPage>
    );
}

export { ExamPreviewing };

const ExamPageContainer = styled('div')({
    marginTop: 10,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});
