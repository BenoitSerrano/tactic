import React from 'react';
import { styled } from '@mui/material';
import { Header } from './Header';

const BACKGROUND_COLOR = '#fafaff';

function Home() {
    return (
        <Container>
            <Header />
        </Container>
    );
}

const Container = styled('div')({
    backgroundColor: BACKGROUND_COLOR,
    minHeight: '100vh',
});

export { Home };
