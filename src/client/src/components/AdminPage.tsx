import { styled } from '@mui/material';
import React from 'react';

function AdminPage(props: { children: React.ReactElement | Array<React.ReactElement | false> }) {
    return <Container>{props.children}</Container>;
}

const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
});

export { AdminPage };
