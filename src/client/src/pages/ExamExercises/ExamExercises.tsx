import { useParams } from 'react-router-dom';
import { ExercisesTable } from './ExercisesTable';
import { useQuery } from '@tanstack/react-query';
import { examApiType } from './types';
import { api } from '../../lib/api';
import { Loader } from '../../components/Loader';

function ExamExercises() {
    const params = useParams<{ examId: string }>();
    const examId = params.examId as string;
    const query = useQuery<examApiType>(['exams', examId], () => api.fetchExam(examId));
    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }
    return (
        <>
            <ExercisesTable examId={examId} exercises={query.data.exercises} />
        </>
    );
}

export { ExamExercises };
