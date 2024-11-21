import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { styled } from '@mui/material';
import { Loader } from '../../../components/Loader';
import { ExercisesEditing } from './ExercisesEditing';
import { examsApi } from '../../../lib/api/examsApi';

function ExamEditingContent() {
    const params = useParams();
    const examId = params.examId as string;
    const query = useQuery({
        queryKey: ['exams', examId, 'with-questions'],
        queryFn: () => examsApi.getExamWithQuestions(examId),
    });

    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    return (
        <MainContainer>
            <ExercisesEditing
                title={query.data.name}
                exercises={query.data.exercises}
                examId={examId}
            />
        </MainContainer>
    );
}

const MainContainer = styled('div')({
    display: 'flex',

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
});

export { ExamEditingContent };
