import { TextField } from '@mui/material';
import { Page } from '../components/Page';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAlert } from '../lib/alert';
import { localStorage } from '../lib/localStorage';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

function SignIn(props: {
    apiCall: (params: { email: string; password: string }) => Promise<{ token: string }>;
    buttonLabel: string;
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
                {props.buttonLabel}
            </Button>
        </Page>
    );

    async function onSignInClick() {
        mutation.mutate({ email, password });
    }
}

export { SignIn };
