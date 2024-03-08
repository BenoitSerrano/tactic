import { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TextField, Typography, styled } from '@mui/material';
import { api } from '../../lib/api';
import { NotLoggedInPage } from '../../components/NotLoggedInPage';
import { Card } from '../../components/Card';
import { Loader } from '../../components/Loader';
import { useAlert } from '../../lib/alert';
import { LoadingButton } from '@mui/lab';
import { pathHandler } from '../../lib/pathHandler';

type studentType = {
    id: string;
    attempts: Array<{ id: string; exam: { id: string } }>;
};

function StudentAuthentication() {
    const params = useParams();
    const examId = params.examId as string;
    const encodedAction = params.encodedAction as string;
    const query = useQuery({ queryKey: ['exams', examId], queryFn: () => api.fetchExam(examId) });
    const { displayAlert } = useAlert();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    const fetchStudentByEmailMutation = useMutation({
        mutationFn: api.fetchStudentByEmailForExam,
        onSuccess: (student: studentType) => {
            const path = pathHandler.getRoutePath('STUDENT_HOME', {
                examId,
                studentId: student.id,
                encodedAction,
            });

            navigate(path);
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
                <Card width="30%">
                    <TitleContainer>
                        <Typography variant="h4">{query.data.name}</Typography>
                    </TitleContainer>
                    <Form onSubmit={handleSubmit}>
                        <EmailTextField
                            autoFocus
                            label="Adresse e-mail"
                            name="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <LoadingButton
                            loading={fetchStudentByEmailMutation.isPending}
                            variant="contained"
                            type="submit"
                            disabled={!email}
                        >
                            Se connecter
                        </LoadingButton>
                    </Form>
                </Card>
            </ContentContainer>
        </NotLoggedInPage>
    );

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        fetchStudentByEmailMutation.mutate({ email, examId });
        event.preventDefault();
    }
}

const TitleContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
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
