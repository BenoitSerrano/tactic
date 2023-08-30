import React from 'react';
import { Page } from '../components/Page';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { localStorage } from '../lib/localStorage';

function Home() {
    const navigate = useNavigate();
    const jwtToken = localStorage.jwtTokenHandler.get();
    return (
        <Page>
            {!!jwtToken ? (
                <Button onClick={onGoToDashboardClick}>Aller au tableau de bord</Button>
            ) : (
                <>
                    <Button onClick={onSignUpClick}>Créer un compte</Button>
                    <Button onClick={onSignInClick}>Se connecter</Button>
                </>
            )}
        </Page>
    );

    function onSignUpClick() {
        navigate('/sign-up');
    }

    function onSignInClick() {
        navigate('/sign-in');
    }

    function onGoToDashboardClick() {
        navigate('/teacher');
    }
}

export { Home };
