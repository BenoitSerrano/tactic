import { styled } from '@mui/material';
import React from 'react';

function AdminPage(props: { children: React.ReactNode | null }) {
    return <Container>{props.children}</Container>;
}

const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
});

export { AdminPage };
