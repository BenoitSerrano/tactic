import React from 'react';
import { Page } from '../components/Page';
import { Typography } from '@mui/material';

function AttemptTimeout() {
    return (
        <Page>
            <Typography>Votre temps est écoulé. Vos réponses ont bien été enregistrées.</Typography>
        </Page>
    );
}

export { AttemptTimeout };
