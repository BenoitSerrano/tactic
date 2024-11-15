import { FormEvent, useState } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TextField, Typography, styled } from '@mui/material';
import { api } from '../../lib/api';
import { NotLoggedInPage } from '../../components/NotLoggedInPage';
import { Card } from '../../components/Card';
import { Loader } from '../../components/Loader';
import { useAlert } from '../../lib/alert';
import { pathHandler } from '../../lib/pathHandler';
import { LoadingIconButton } from '../../components/LoadingIconButton';
import { examsApi } from '../../lib/api/examsApi';

type studentType = {
    id: string;
    firstName: string;
    lastName: string;
    attempts: Array<{ id: string; exam: { id: string } }>;
};

function StudentAuthentication() {
    const params = useParams();
    const examId = params.examId as string;
    const encodedAction = params.encodedAction as string;
    const query = useQuery({
        queryKey: ['exams', examId],
        queryFn: () => examsApi.getExam(examId),
    });
    const { displayAlert } = useAlert();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    const fetchStudentByEmailMutation = useMutation({
        mutationFn: api.fetchStudentByEmailForExam,
        onSuccess: (student: studentType) => {
            const hasStudentAlreadyRegistered = student.firstName !== '' || student.lastName !== '';

            const path = hasStudentAlreadyRegistered
                ? pathHandler.getRoutePath('STUDENT_HOME', {
                      examId,
                      studentId: student.id,
                      encodedAction,
                  })
                : pathHandler.getRoutePath('STUDENT_REGISTRATION', {
                      examId,
                      studentId: student.id,
                      encodedAction,
                  });

            navigate(path);
        },
        onError: (error) => {
            console.warn(error);
            displayAlert({
                text: `L'adresse "${email}" n'existe pas pour cet examen.`,
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
                <Card size="medium">
                    <TitleContainer>
                        <Typography variant="h4">{query.data.name}</Typography>
                    </TitleContainer>
                    <Form onSubmit={handleSubmit}>
                        <EmailTextField
                            variant="outlined"
                            fullWidth
                            autoFocus
                            label="Adresse e-mail"
                            name="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <LoadingIconButton
                            IconComponent={LoginIcon}
                            isLoading={fetchStudentByEmailMutation.isPending}
                            isDisabled={!email}
                            label="Se connecter"
                            type="submit"
                        />
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
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'column',
});

const EmailTextField = styled(TextField)(({ theme }) => ({ marginBottom: theme.spacing(1) }));

const ContentContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
});

export { StudentAuthentication };
