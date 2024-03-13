import { styled } from '@mui/material/styles';
import { Header } from './Header';
import { HEADER_HEIGHT } from '../constants';
import { Logo } from './Logo';

function NotLoggedInPage(props: { children: React.ReactNode; title?: JSX.Element }) {
    return (
        <Container>
            <Header
                buttons={[]}
                LeftContent={<Logo variant="full" />}
                MiddleContent={props.title}
            />
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
