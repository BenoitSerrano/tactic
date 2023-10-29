import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { styled } from '@mui/material';
import { NotLoggedInPage } from '../../components/NotLoggedInPage';
import { Loader } from '../../components/Loader';
import { api } from '../../lib/api';
import { QuestionsAnswering } from './QuestionsAnswering';
import { attemptWithoutAnswersType } from './types';
import { computeShouldNavigateToExamDone } from './lib/computeShouldNavigateToExamDone';

function ExamTaking() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const studentId = params.studentId as string;
    const navigate = useNavigate();
    const query = useQuery<attemptWithoutAnswersType>(['attempts-without-answers', attemptId], () =>
        api.fetchAttemptWithoutAnswers(attemptId),
    );

    if (!query.data) {
        return (
            <NotLoggedInPage>
                <Loader />
            </NotLoggedInPage>
        );
    }

    const examDonePath = `/student/students/${studentId}/exam-done`;

    const shouldNavigateToExamDone = computeShouldNavigateToExamDone(new Date(), {
        duration: query.data.exam.duration,
        endedAt: query.data.endedAt,
        extraTime: query.data.exam.extraTime,
        startedAt: query.data.startedAt,
    });

    if (shouldNavigateToExamDone) {
        return <Navigate to={examDonePath} />;
    }

    return (
        <NotLoggedInPage>
            <ExamPageContainer>
                <QuestionsAnswering
                    title={query.data.exam.name}
                    exercises={query.data.exam.exercises}
                    attemptId={attemptId}
                    onExamDone={onExamDone}
                />
            </ExamPageContainer>
        </NotLoggedInPage>
    );

    function onExamDone() {
        navigate(examDonePath);
    }
}

export { ExamTaking };

const ExamPageContainer = styled('div')({
    marginTop: 10,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});
