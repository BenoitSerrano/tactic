import { Button, TextField } from '@mui/material';
import { Page } from '../components/Page';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAlert } from '../lib/alert';
import { localStorage } from '../lib/localStorage';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { displayAlert } = useAlert();

    const loginMutation = useMutation({
        mutationFn: api.login,
        onSuccess: (data) => {
            const { token } = data;
            localStorage.jwtTokenHandler.set(token);
            navigate(`/teacher`);
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: 'Une erreur est survenue lors de la connexion.',
            });
        },
    });

    return (
        <Page>
            <TextField
                name="email"
                type="email"
                label="Adresse e-mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
                name="password"
                type="password"
                label="Mot de passe"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <Button variant="contained" onClick={onSignInClick}>
                Se connecter
            </Button>
        </Page>
    );

    async function onSignInClick() {
        loginMutation.mutate({ email, password });
    }
}

export { SignIn };
