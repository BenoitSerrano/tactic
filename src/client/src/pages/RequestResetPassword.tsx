import { Button, TextField, Typography, styled } from '@mui/material';
import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { FormEvent, useState } from 'react';
import { Card } from '../components/Card';
import { useMutation } from '@tanstack/react-query';
import { useAlert } from '../lib/alert';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { pathHandler } from '../lib/pathHandler';

function RequestResetPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const { displayAlert } = useAlert();
    const mutation = useMutation({
        mutationFn: api.createResetPasswordRequest,
        onSuccess: (data) => {
            navigate(pathHandler.getRoutePath('RESET_PASSWORD_REQUESTED'));
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: 'Une erreur est survenue lors de la demande de réinitialisation de votre mot de passe. Veuillez patienter une dizaine de minutes et réessayer.',
            });
        },
    });

    return (
        <NotLoggedInPage>
            <ContentContainer>
                <Card width="40%">
                    <CardContent onSubmit={handleSubmit}>
                        <TitleContainer>
                            <Typography variant="h2">
                                Demande de réinitialisation de mot de passe
                            </Typography>
                        </TitleContainer>

                        <FieldsContainer>
                            <FieldContainer>
                                <TextField
                                    fullWidth
                                    name="email"
                                    type="email"
                                    label="Adresse e-mail"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </FieldContainer>
                        </FieldsContainer>

                        <Button type="submit" variant="contained" disabled={!email}>
                            Demander un nouveau mot de passe
                        </Button>
                    </CardContent>
                </Card>
            </ContentContainer>
        </NotLoggedInPage>
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        mutation.mutate(email);
        event.preventDefault();
    }
}
const ContentContainer = styled('div')({
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
});
const CardContent = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
}));
const FieldContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(2) }));
const FieldsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
}));
const TitleContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(6),
    textAlign: 'center',
}));

export { RequestResetPassword };
