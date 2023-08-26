import { Button, TextField } from '@mui/material';
import { Page } from '../components/Page';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAlert } from '../lib/alert';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { displayAlert } = useAlert();
    const createUserMutation = useMutation({
        mutationFn: api.createUser,
        onSuccess: () => {
            displayAlert({
                variant: 'success',
                text: 'Votre compte a bien été créé. Vous pouvez maintenant vous connecter',
            });
        },
        onError: (truc) => {
            displayAlert({
                variant: 'error',
                text: 'Une erreur est survenue lors de la création de votre compte.',
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
            <Button variant="contained" onClick={onSignUpClick}>
                Créer un compte
            </Button>
        </Page>
    );

    async function onSignUpClick() {
        createUserMutation.mutate({ email, password });
    }
}

export { SignUp };
