import React from 'react';
import { styled } from '@mui/material/styles';

function Page(props: { children: React.ReactElement | React.ReactElement[] }) {
    return <Container>{props.children}</Container>;
}

const Container = styled('div')({
    paddingLeft: '15%',
    paddingRight: '15%',
});

export { Page };
