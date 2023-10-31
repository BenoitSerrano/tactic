import { Button, TextField, Typography, styled } from '@mui/material';
import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { FormEvent, useState } from 'react';
import { Card } from '../components/Card';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAlert } from '../lib/alert';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Loader } from '../components/Loader';
import { LoadingButton } from '@mui/lab';

type userApiType = { id: string; email: string };

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [searchParams] = useSearchParams();
    const resetPasswordRequestId = searchParams.get('resetPasswordRequestId') || '';
    const navigate = useNavigate();
    const { displayAlert } = useAlert();

    const userQuery = useQuery<userApiType>({
        queryFn: () => api.fetchResetPasswordRequestUser(resetPasswordRequestId),
        queryKey: ['resetPasswordRequest', resetPasswordRequestId, 'user'],
    });

    const resetPasswordMutation = useMutation({
        mutationFn: api.resetPassword,
        onSuccess: () => {
            navigate(`/reset-password-success`);
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: 'Une erreur est survenue lors de la réinitialisation du mot de passe. Veuillez réessayer.',
            });
        },
    });

    if (!resetPasswordRequestId) {
        return <Navigate to="/sign-in" />;
    }

    if (!userQuery.data) {
        if (userQuery.isError) {
            return <Navigate to="/reset-password-failure" />;
        }
    }

    return (
        <NotLoggedInPage>
            <ContentContainer>
                <Card width="40%">
                    {!!userQuery.isLoading && <Loader />}
                    {!!userQuery.data && (
                        <CardContent onSubmit={handleSubmit}>
                            <TitleContainer>
                                <Typography variant="h2">Réinitialiser le mot de passe</Typography>
                            </TitleContainer>

                            <FieldsContainer>
                                <FieldContainer>
                                    <TextField
                                        fullWidth
                                        name="email"
                                        type="email"
                                        disabled
                                        label="Adresse email"
                                        value={userQuery.data.email}
                                    />
                                </FieldContainer>
                                <FieldContainer>
                                    <TextField
                                        fullWidth
                                        name="password"
                                        type="password"
                                        label="Nouveau mot de passe"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </FieldContainer>
                            </FieldsContainer>

                            <LoadingButton
                                type="submit"
                                variant="contained"
                                disabled={!password}
                                loading={resetPasswordMutation.isPending}
                            >
                                Changer de mot de passe
                            </LoadingButton>
                        </CardContent>
                    )}
                </Card>
            </ContentContainer>
        </NotLoggedInPage>
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        resetPasswordMutation.mutate({ password, resetPasswordRequestId });
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

export { ResetPassword };
