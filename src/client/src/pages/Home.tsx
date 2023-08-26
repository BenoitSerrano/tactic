import React from 'react';
import { Page } from '../components/Page';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    return (
        <Page>
            <Button onClick={onSignUpClick}>Créer un compte</Button>
            <Button onClick={onSignInClick}>Se connecter</Button>
        </Page>
    );

    function onSignUpClick() {
        navigate('/sign-up');
    }

    function onSignInClick() {
        navigate('/sign-in');
    }
}

export { Home };
