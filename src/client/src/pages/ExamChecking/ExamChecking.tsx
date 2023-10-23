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
    const query = useQuery<attemptWithAnswersApiType>(['attempts', attemptId], () =>
        api.fetchAttemptWithAnswers(attemptId),
    );

    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    return (
        <MainContainer>
            <QuestionsChecking
                attemptId={attemptId}
                examName={query.data.exam.name}
                questions={query.data.exam.questions}
            />
        </MainContainer>
    );
}

const MainContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
});

export { ExamChecking };
