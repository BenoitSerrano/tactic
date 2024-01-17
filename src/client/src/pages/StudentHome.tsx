import { Typography, styled } from '@mui/material';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { Button } from '../components/Button';
import { Loader } from '../components/Loader';
import { pathHandler } from '../lib/pathHandler';
import { computePathKeyToNavigateTo } from '../lib/computePathKeyToNavigateTo';

type attemptApiType = {
    attempt:
        | {
              id: string;
              correctedAt: string | null;
          }
        | undefined;
};

type examApiType = {
    id: string;
    name: string;
    archivedAt: string | null;
};

function StudentHome() {
    const params = useParams();
    const studentId = params.studentId as string;
    const examId = params.examId as string;
    const navigate = useNavigate();

    const attemptQuery = useQuery<attemptApiType>({
        queryKey: ['exams', examId, 'students', studentId, 'attempts'],
        queryFn: () => api.searchAttempt({ examId, studentId }),
    });

    const examQuery = useQuery<examApiType>({
        queryKey: ['exams', examId],
        queryFn: () => api.fetchExam(examId),
    });

    const createAttemptMutation = useMutation({
        mutationFn: api.createAttempt,
        onSuccess: (attempt: any) => {
            const path = pathHandler.getRoutePath('EXAM_TAKING', {
                studentId,
                attemptId: attempt.id,
            });
            navigate(path);
        },
    });

    if (!attemptQuery.data || !examQuery.data) {
        if (attemptQuery.isLoading || examQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    if (!!examQuery.data.archivedAt) {
        const pathToNavigateTo = pathHandler.getRoutePath('EXAM_ARCHIVED');
        return <Navigate to={pathToNavigateTo} />;
    }

    const pathKeyToNavigateTo = computePathKeyToNavigateTo(attemptQuery.data.attempt);

    if (pathKeyToNavigateTo !== 'STUDENT_HOME') {
        const pathToNavigateTo = pathHandler.getRoutePath(pathKeyToNavigateTo, {
            studentId,
            attemptId: attemptQuery.data.attempt?.id || '',
        });
        return <Navigate to={pathToNavigateTo} />;
    }

    return (
        <NotLoggedInPage>
            <ContentContainer>
                {examQuery.data && <Title variant="h4">{examQuery.data.name}</Title>}

                <Button variant="contained" onClick={launchExam}>
                    Lancer le test
                </Button>
            </ContentContainer>
        </NotLoggedInPage>
    );

    function launchExam() {
        createAttemptMutation.mutate({ examId, studentId });
    }
}

export { StudentHome };

const ContentContainer = styled('div')({
    width: '50%',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
});

const Title = styled(Typography)(({ theme }) => ({ marginBottom: theme.spacing(3) }));
