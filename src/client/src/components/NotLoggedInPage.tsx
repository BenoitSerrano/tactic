import { styled } from '@mui/material/styles';
import { Header } from './Header';

function NotLoggedInPage(props: {
    children: React.ReactElement | React.ReactElement[];
    title?: JSX.Element;
}) {
    return (
        <Container>
            <Header buttons={[]} title={props.title} />
            {props.children}
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
}));

export { NotLoggedInPage };
