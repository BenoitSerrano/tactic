import { TextField, Typography, styled } from '@mui/material';
import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { FormEvent, useState } from 'react';
import { Card } from '../components/Card';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAlert } from '../lib/alert';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { LoadingButton } from '@mui/lab';
import { pathHandler } from '../lib/pathHandler';
import { resetPasswordRequestsApi } from '../lib/api/resetPasswordRequestsApi';
import { usersApi } from '../lib/api/usersApi';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [searchParams] = useSearchParams();
    const resetPasswordRequestId = searchParams.get('resetPasswordRequestId') || '';
    const navigate = useNavigate();
    const { displayAlert } = useAlert();

    const resetPasswordRequestQuery = useQuery({
        queryFn: () =>
            resetPasswordRequestsApi.getResetPasswordRequestWithUser(resetPasswordRequestId),
        queryKey: ['resetPasswordRequest', resetPasswordRequestId, 'with-user'],
    });

    const resetPasswordMutation = useMutation({
        mutationFn: usersApi.updateUserPasswordByResetPasswordRequest,
        onSuccess: () => {
            navigate(pathHandler.getRoutePath('RESET_PASSWORD_SUCCESS'));
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

    if (!resetPasswordRequestQuery.data) {
        if (resetPasswordRequestQuery.isError) {
            return <Navigate to="/reset-password-failure" />;
        }
    }

    return (
        <NotLoggedInPage>
            <ContentContainer>
                <Card size="medium">
                    {!!resetPasswordRequestQuery.isLoading && <Loader />}
                    {!!resetPasswordRequestQuery.data && (
                        <CardContent onSubmit={handleSubmit}>
                            <TitleContainer>
                                <Typography variant="h2">Réinitialiser le mot de passe</Typography>
                            </TitleContainer>

                            <FieldsContainer>
                                <FieldContainer>
                                    <TextField
                                        autoFocus
                                        fullWidth
                                        name="email"
                                        type="email"
                                        disabled
                                        label="Adresse email"
                                        value={resetPasswordRequestQuery.data.user.email}
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
