import { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TextField, Typography, styled } from '@mui/material';
import { api } from '../lib/api';
import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Loader } from '../components/Loader';
import { useAlert } from '../lib/alert';

function StudentAuthentication() {
    const params = useParams();
    const examId = params.examId as string;
    const query = useQuery(['exams', examId], () => api.fetchExam(examId));
    const { displayAlert } = useAlert();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    const getStudentIdMutation = useMutation({
        mutationFn: api.fetchStudentId,
        onSuccess: (student: { id: string }) => {
            navigate(`/student/exams/${examId}/students/${student.id}`);
        },
        onError: (error) => {
            console.warn(error);
            displayAlert({
                text: `L'adresse "${email}" n'existe pas pour ce test.`,
                variant: 'error',
            });
        },
    });
    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    return (
        <NotLoggedInPage>
            <ContentContainer>
                <Card>
                    <TitleContainer>
                        <Typography variant="h4">{query.data.name}</Typography>
                    </TitleContainer>
                    <Form onSubmit={handleSubmit}>
                        <EmailTextField
                            label="Adresse e-mail"
                            name="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <Button variant="contained" type="submit" disabled={!email}>
                            Se connecter
                        </Button>
                    </Form>
                </Card>
            </ContentContainer>
        </NotLoggedInPage>
    );

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        getStudentIdMutation.mutate(email);
        event.preventDefault();
    }
}

const TitleContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
}));

const Form = styled('form')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});

const EmailTextField = styled(TextField)(({ theme }) => ({ marginRight: theme.spacing(1) }));

const ContentContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
});

export { StudentAuthentication };
