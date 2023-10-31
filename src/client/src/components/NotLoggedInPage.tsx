import { styled } from '@mui/material/styles';
import { Header } from './Header';
import { HEADER_HEIGHT } from '../constants';

function NotLoggedInPage(props: {
    children: React.ReactElement | React.ReactElement[];
    title?: JSX.Element;
}) {
    return (
        <Container>
            <Header logoLink="/" buttons={[]} title={props.title} />
            <ChildrenContainer>{props.children}</ChildrenContainer>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
}));
const ChildrenContainer = styled('div')({
    paddingTop: HEADER_HEIGHT,
    display: 'flex',
    flex: 1,
});

export { NotLoggedInPage };
