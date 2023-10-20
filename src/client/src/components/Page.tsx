import { styled } from '@mui/material/styles';

function Page(props: { children: React.ReactElement | React.ReactElement[] }) {
    return <Container>{props.children}</Container>;
}

const Container = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: '100vh',
}));

export { Page };
