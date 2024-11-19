import { FormEvent, useState } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TextField, Typography, styled } from '@mui/material';
import { StudentPage } from '../../components/StudentPage';
import { Card } from '../../components/Card';
import { Loader } from '../../components/Loader';
import { useAlert } from '../../lib/alert';
import { pathHandler } from '../../lib/pathHandler';
import { LoadingIconButton } from '../../components/LoadingIconButton';
import { studentsApi } from '../../lib/api/studentsApi';

function StudentRegistration() {
    const params = useParams();
    const examId = params.examId as string;
    const studentId = params.studentId as string;
    const encodedAction = params.encodedAction as string;
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ['students', studentId],
        queryFn: () => studentsApi.getStudent({ studentId }),
    });
    const { displayAlert } = useAlert();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const updateStudentNamesMutation = useMutation({
        mutationFn: studentsApi.updateStudentNames,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`exams`, examId] });

            const path = pathHandler.getRoutePath('STUDENT_HOME', {
                examId,
                studentId,
                encodedAction,
            });

            navigate(path);
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: 'Une erreur est survenue. Veuillez réessayer de soumettre le formulaire.',
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
        <StudentPage>
            <ContentContainer>
                <Card size="medium">
                    <TitleContainer>
                        <Typography variant="h4">Inscription</Typography>
                    </TitleContainer>
                    <SubtitleContainer>
                        <Typography variant="h6">
                            Avant de commencer, veuillez renseigner dans les champs ci-dessous votre
                            prénom et nom.
                        </Typography>
                    </SubtitleContainer>
                    <Form onSubmit={handleSubmit}>
                        <StyledTextField
                            variant="outlined"
                            fullWidth
                            autoFocus
                            label="Prénom"
                            name="firstName"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                        />
                        <StyledTextField
                            variant="outlined"
                            fullWidth
                            label="Nom de famille"
                            name="lastName"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                        />
                        <LoadingIconButton
                            IconComponent={LoginIcon}
                            isLoading={updateStudentNamesMutation.isPending}
                            isDisabled={!firstName || !lastName}
                            label="Aller à l'examen"
                            type="submit"
                        />
                    </Form>
                </Card>
            </ContentContainer>
        </StudentPage>
    );

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        updateStudentNamesMutation.mutate({ studentId, firstName, lastName });
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

const SubtitleContainer = styled('div')(({ theme }) => ({
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

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
}));

const ContentContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
});

export { StudentRegistration };
