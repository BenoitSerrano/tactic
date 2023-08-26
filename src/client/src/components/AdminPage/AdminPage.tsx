import { styled } from '@mui/material';
import React from 'react';
import { AdminHeader } from './AdminHeader';

function AdminPage(props: { children: React.ReactNode | null }) {
    return (
        <Container>
            <AdminHeader />
            {props.children}
        </Container>
    );
}

const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
});

export { AdminPage };
