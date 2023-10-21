import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { styled } from '@mui/material';
import { Loader } from '../../components/Loader';
import { QuestionChecking } from './QuestionChecking';
import { TestPageLayout } from '../../components/TestPageLayout';

function ExamChecking() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const query = useQuery(['attempts', attemptId], () => api.fetchAttemptWithAnswers(attemptId));

    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    return (
        <MainContainer>
            <TestPageLayout title={query.data.exam.name}>
                {query.data.exam.questions.map((question: any, index: number) => (
                    <QuestionCheckingContainer>
                        <QuestionChecking
                            key={'question' + question.id}
                            index={index + 1}
                            question={question}
                        />
                    </QuestionCheckingContainer>
                ))}
            </TestPageLayout>
        </MainContainer>
    );
}

const QuestionCheckingContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
}));

const MainContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
});

export { ExamChecking };
