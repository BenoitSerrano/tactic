import { Typography, styled } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Page } from '../components/Page';
import { Button } from '../components/Button';

function StudentHome() {
    const params = useParams();
    const studentId = params.studentId as string;
    const examId = params.examId as string;
    const navigate = useNavigate();

    const query = useQuery(['exams', examId, 'students', studentId, 'attempts'], () =>
        api.searchAttempt({ examId, studentId }),
    );

    const examQuery = useQuery(['exams', examId], () => api.fetchExam(examId));

    const createAttemptMutation = useMutation({
        mutationFn: api.createAttempt,
        onSuccess: (attempt: any) => {
            navigate(`/student/students/${studentId}/attempts/${attempt.id}`);
        },
    });

    if (!query.data) {
        return <div />;
    }

    if (query.data.length > 0) {
        navigate(`/student/students/${studentId}/attempts/${query.data[0].id}`);
        return <div />;
    }

    return (
        <Page>
            {examQuery.data && <Typography variant="h4">{examQuery.data.name}</Typography>}
            <ContentContainer>
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
                    Passer le test
                </Button>
            </ContentContainer>
        </Page>
    );

    function launchExam() {
        createAttemptMutation.mutate({ examId, studentId });
    }
}

export { StudentHome };

const ContentContainer = styled('div')({
    width: '50%',
    // dislay: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
});
