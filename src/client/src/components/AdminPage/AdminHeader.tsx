import React from 'react';
import { styled } from '@mui/material';
import { Breadcrumbs } from './Breadcrumbs';
import { LogoutButton } from './LogoutButton';

function AdminHeader() {
    return (
        <Container>
            <Breadcrumbs />
            <LogoutButton />
        </Container>
    );
}
const Container = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
});
export { AdminHeader };
