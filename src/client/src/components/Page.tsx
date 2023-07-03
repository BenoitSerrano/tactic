import React from 'react';
import { styled } from '@mui/material/styles';

function Page(props: { children: React.ReactElement | React.ReactElement[] }) {
    return <Container>{props.children}</Container>;
}

const Container = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
});

export { Page };
