import React from 'react';
import { Page } from '../components/Page';
import { Typography } from '@mui/material';

function AttemptAlreadySubmitted() {
    return (
        <Page>
            <Typography>Vous avez déjà soumis vos réponses pour cet examen.</Typography>
        </Page>
    );
}

export { AttemptAlreadySubmitted };
