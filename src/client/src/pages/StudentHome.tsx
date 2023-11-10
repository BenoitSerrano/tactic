import { Typography, styled } from '@mui/material';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { Button } from '../components/Button';
import { Loader } from '../components/Loader';

function StudentHome() {
    const params = useParams();
    const studentId = params.studentId as string;
    const examId = params.examId as string;
    const navigate = useNavigate();

    const attemptQuery = useQuery({
        queryKey: ['exams', examId, 'students', studentId, 'attempts'],
        queryFn: () => api.searchAttempt({ examId, studentId }),
    });

    const examQuery = useQuery({
        queryKey: ['exams', examId],
        queryFn: () => api.fetchExam(examId),
    });

    const createAttemptMutation = useMutation({
        mutationFn: api.createAttempt,
        onSuccess: (attempt: any) => {
            navigate(`/student/students/${studentId}/attempts/${attempt.id}/take`);
        },
    });

    if (!attemptQuery.data) {
        if (attemptQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    if (attemptQuery.data.length > 0) {
        return (
            <Navigate
                to={`/student/students/${studentId}/attempts/${attemptQuery.data[0].id}/take`}
            />
        );
    }

    return (
        <NotLoggedInPage>
            <ContentContainer>
                {examQuery.data && <Typography variant="h4">{examQuery.data.name}</Typography>}
                <p>
                    <Typography>
                        Vous allez passer un examen de grammaire française niveau avancé (C1-C2).
                        Vous disposez de 90 minutes pour répondre à toutes les questions. Une fois
                        l'examen lancé,{' '}
                        <strong>
                            ne quittez pas la page avant d'avoir fini de répondre aux questions
                        </strong>{' '}
                        (la plateforme détectera si vous quittez la page et vous serez pénalisé.e).
                    </Typography>
                </p>

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
