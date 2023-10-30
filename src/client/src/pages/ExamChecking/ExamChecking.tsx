import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { IconButton, styled } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api } from '../../lib/api';
import { Loader } from '../../components/Loader';
import { QuestionsChecking } from './QuestionsChecking';
import { attemptWithAnswersApiType } from './types';
import { computeAttemptIdNeighbours } from './lib/computeAttemptIdNeighbours';

function ExamChecking() {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const attemptId = params.attemptId as string;
    const examId = params.examId as string;
    const attemptWithAnswersQuery = useQuery<attemptWithAnswersApiType>({
        queryKey: ['attempts', attemptId],
        queryFn: () => api.fetchAttemptWithAnswers(attemptId),
    });

    const navigate = useNavigate();

    if (!attemptWithAnswersQuery.data) {
        if (attemptWithAnswersQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    const { next, previous } = computeAttemptIdNeighbours(
        attemptId,
        searchParams.get('attemptIds'),
    );

    return (
        <MainContainer>
            <LeftArrowContainer>
                <IconButton disabled={!previous} onClick={buildOnArrowClick(previous)}>
                    <ArrowBackIcon fontSize="large" />
                </IconButton>
            </LeftArrowContainer>
            <QuestionsChecking
                onEditAnswers={attemptWithAnswersQuery.refetch}
                studentEmail={attemptWithAnswersQuery.data.studentEmail}
                attemptId={attemptId}
                examId={examId}
                exercises={attemptWithAnswersQuery.data.exam.exercises}
                examName={attemptWithAnswersQuery.data.exam.name}
            />
            <RightArrowContainer>
                <IconButton disabled={!next} onClick={buildOnArrowClick(next)}>
                    <ArrowForwardIcon fontSize="large" />
                </IconButton>
            </RightArrowContainer>
        </MainContainer>
    );

    function buildOnArrowClick(attemptIdToNavigateTo: string | undefined) {
        return () => {
            if (!attemptIdToNavigateTo) {
                return;
            }
            navigateToNewAttempt(attemptIdToNavigateTo);
        };
    }

    function navigateToNewAttempt(newAttemptId: string) {
        navigate(
            `/teacher/exams/${examId}/results/${newAttemptId}?attemptIds=${searchParams.get(
                'attemptIds',
            )}`,
        );
    }
}

const MainContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
});

const ARROW_CONTAINER_SIZE = 100;

const LeftArrowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    left: theme.spacing(4),
    top: `calc(100vh / 2 - ${ARROW_CONTAINER_SIZE / 2}px)`,
    width: ARROW_CONTAINER_SIZE,
    height: ARROW_CONTAINER_SIZE,
}));

const RightArrowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    right: theme.spacing(4),
    top: `calc(100vh / 2 - ${ARROW_CONTAINER_SIZE / 2}px)`,
    width: ARROW_CONTAINER_SIZE,
    height: ARROW_CONTAINER_SIZE,
}));

export { ExamChecking };
