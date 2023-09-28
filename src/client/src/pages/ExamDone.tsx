import React from 'react';
import { Typography, styled } from '@mui/material';
import { Page } from '../components/Page';

function ExamDone() {
    return (
        <Page>
            <MainContainer>
                <Header>
                    <Typography variant="h4">
                        Merci d'avoir répondu au test, vos réponses ont été enregistrées.
                    </Typography>
                </Header>
            </MainContainer>
        </Page>
    );
}

const MainContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '50%',
});

const Header = styled('div')({
    textAlign: 'center',
    marginBottom: '20px',
});

export { ExamDone };
