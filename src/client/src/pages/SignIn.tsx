import { TextField, Typography, styled } from '@mui/material';
import { Page } from '../components/Page';
import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAlert } from '../lib/alert';
import { localStorage } from '../lib/localStorage';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

function SignIn(props: {
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
            navigate(`/teacher`);
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: 'Une erreur est survenue.',
            });
        },
    });
    console.log('HEIH');

    return (
        <Page>
            <Card width="40%">
                <CardContent onSubmit={handleSubmit}>
                    <TitleContainer>
                        <Typography variant="h2">{props.title}</Typography>
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
                    </FieldsContainer>

                    <Button type="submit" variant="contained" disabled={!password || !email}>
                        {props.title}
                    </Button>
                </CardContent>
            </Card>
        </Page>
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        mutation.mutate({ email, password });
        event.preventDefault();
    }
}

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
