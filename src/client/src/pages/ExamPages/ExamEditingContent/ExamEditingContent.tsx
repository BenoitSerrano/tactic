import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { styled } from '@mui/material';
import { Loader } from '../../../components/Loader';
import { api } from '../../../lib/api';
import { examWithQuestionsApiType } from './types';
import { ExercisesEditing } from './ExercisesEditing';
import { Breadcrumbs } from '../components/Breadcrumbs';

function ExamEditingContent() {
    const params = useParams();
    const examId = params.examId as string;
    const query = useQuery<examWithQuestionsApiType>({
        queryKey: ['exam-with-questions', examId],
        queryFn: () => api.fetchExamWithQuestions(examId),
    });
    const establishmentsQuery = useQuery({
        queryKey: ['establishments'],
        queryFn: api.fetchEstablishments,
    });

    if (!query.data || !establishmentsQuery.data) {
        if (query.isLoading || establishmentsQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    return (
        <MainContainer>
            <Breadcrumbs establishments={establishmentsQuery.data} />
            <PageContainer>
                <ExercisesEditing
                    title={query.data.name}
                    exercises={query.data.exercises}
                    examId={examId}
                />
            </PageContainer>
        </MainContainer>
    );
}

const MainContainer = styled('div')({
    display: 'flex',

    background: 'red',
    flexDirection: 'column',
    // alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
});

const PageContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

export { ExamEditingContent };
