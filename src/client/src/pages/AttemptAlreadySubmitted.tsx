import React from 'react';
import { Page } from '../components/Page';
import { Typography } from '@mui/material';

function AttemptAlreadySubmitted() {
    return (
        <Page>
            <Typography>
                Vos réponses ont bien été enregistrées. Vous recevrez la confirmation de votre
                groupe avant le stage de septembre.
            </Typography>
        </Page>
    );
}

export { AttemptAlreadySubmitted };
