import { styled } from '@mui/material';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { StudentPage } from '../../components/StudentPage';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';
import { pathHandler } from '../../lib/pathHandler';
import { computePathKeyToNavigateTo } from '../../lib/computePathKeyToNavigateTo';
import { attemptActionEncoder } from '../../lib/attemptActionEncoder';
import { ExamStartText } from '../ExamParameters/components/ExamStartText';
import { examsApi } from '../../lib/api/examsApi';
import { attemptsApi } from '../../lib/api/attemptsApi';

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
    startText: string;
    endText: string;
    duration: number | null;
};

function StudentHome() {
    const params = useParams();
    const studentId = params.studentId as string;
    const examId = params.examId as string;
    const encodedAction = params.encodedAction as string;
    const attemptAction = attemptActionEncoder.decode(encodedAction);
    const navigate = useNavigate();

    const attemptQuery = useQuery<attemptApiType>({
        queryKey: ['exams', examId, 'students', studentId, 'attempts'],
        queryFn: () => attemptsApi.searchAttempt({ examId, studentId }),
    });

    const examQuery = useQuery<examApiType>({
        queryKey: ['exams', examId],
        queryFn: () => examsApi.getExam(examId),
    });

    const createAttemptMutation = useMutation({
        mutationFn: attemptsApi.createAttempt,
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

    const pathKeyToNavigateTo = computePathKeyToNavigateTo(
        attemptQuery.data.attempt,
        attemptAction,
    );

    if (pathKeyToNavigateTo !== 'STUDENT_HOME') {
        const pathToNavigateTo = pathHandler.getRoutePath(pathKeyToNavigateTo, {
            studentId,
            attemptId: attemptQuery.data.attempt?.id || '',
        });
        return <Navigate to={pathToNavigateTo} />;
    }

    return (
        <StudentPage>
            <ContentContainer>
                <ExamStartText
                    name={examQuery.data.name}
                    duration={examQuery.data.duration}
                    examStartText={examQuery.data.startText}
                />
                <Button variant="contained" onClick={launchExam}>
                    Lancer l'examen
                </Button>
            </ContentContainer>
        </StudentPage>
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
