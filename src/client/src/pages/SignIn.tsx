import { TextField, Typography, styled } from '@mui/material';
import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAlert } from '../lib/alert';
import { localStorage } from '../lib/localStorage';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Link } from '../components/Link';
import { pathHandler } from '../lib/pathHandler';
import { LoadingButton } from '@mui/lab';

function SignIn(props: {
    shouldDisplayResetPasswordLink?: boolean;
    apiCall: (params: { email: string; password: string }) => Promise<{ token: string }>;
    title: string;
}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { displayAlert } = useAlert();

    const mutation = useMutation({
        mutationFn: props.apiCall,
        onSuccess: (data) => {
            const { token } = data;
            localStorage.jwtTokenHandler.set(token);
            navigate(pathHandler.getRoutePath('TEACHER_HOME'));
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: 'Une erreur est survenue.',
            });
        },
    });

    return (
        <NotLoggedInPage>
            <ContentContainer>
                <Card size="medium">
                    <CardContent onSubmit={handleSubmit}>
                        <TitleContainer>
                            <Typography variant="h2">{props.title}</Typography>
                        </TitleContainer>

                        <FieldsContainer>
                            <FieldContainer>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    name="email"
                                    type="email"
                                    label="Adresse e-mail"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </FieldContainer>
                            <FieldContainer>
                                <TextField
                                    fullWidth
                                    name="password"
                                    type="password"
                                    label="Mot de passe"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </FieldContainer>
                            {!!props.shouldDisplayResetPasswordLink && (
                                <DisplayPasswordLinkContainer>
                                    <Link to="/request-reset-password">
                                        <Typography>Mot de passe oublié ?</Typography>
                                    </Link>
                                </DisplayPasswordLinkContainer>
                            )}
                        </FieldsContainer>

                        <LoadingButton
                            loading={mutation.isPending}
                            type="submit"
                            variant="contained"
                            disabled={!password || !email}
                        >
                            {props.title}
                        </LoadingButton>
                    </CardContent>
                </Card>
            </ContentContainer>
        </NotLoggedInPage>
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        mutation.mutate({ email, password });
        event.preventDefault();
    }
}

const ContentContainer = styled('div')({
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
});

const DisplayPasswordLinkContainer = styled('div')({
    display: 'flex',
    textDecorationLine: 'underline',
    alignItems: 'center',
    justifyContent: 'center',
});

const CardContent = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
}));

const FieldsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
}));
const FieldContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(2) }));
const TitleContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(6),
    textAlign: 'center',
}));

export { SignIn };
