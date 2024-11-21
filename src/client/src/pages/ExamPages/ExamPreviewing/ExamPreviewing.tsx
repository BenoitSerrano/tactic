import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { styled } from '@mui/material';
import { Loader } from '../../../components/Loader';
import { QuestionsPreviewing } from './QuestionsPreviewing';
import { examWithoutAnswersType } from '../types';
import { StudentPage } from '../../../components/StudentPage';
import { examsApi } from '../../../lib/api/examsApi';

function ExamPreviewing() {
    const params = useParams();
    const examId = params.examId as string;
    const query = useQuery<examWithoutAnswersType>({
        queryKey: ['exams', examId, 'without-answers'],
        queryFn: () => examsApi.getExamWithoutAnswers(examId),
    });

    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    return (
        <StudentPage>
            <MainContainer>
                <QuestionsPreviewing
                    title={query.data.name}
                    exercises={query.data.exercises}
                    examId={examId}
                />
            </MainContainer>
        </StudentPage>
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
