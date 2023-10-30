import { styled } from '@mui/material';
import { localStorage } from '../../lib/localStorage';
import { Navigate } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';
import { Header } from '../Header';
import { LogoutButton } from './LogoutButton';
import { HEADER_HEIGHT } from '../../constants';

function AdminPage(props: { children: React.ReactNode | null }) {
    const token = localStorage.jwtTokenHandler.get();
    if (!token) {
        return <Navigate to="/sign-in" />;
    }
    return (
        <Container>
            <Header buttons={[<LogoutButton />]} logoLink="/teacher" />

            <ContentContainer>
                <Breadcrumbs />
                <ChildrenContainer>{props.children}</ChildrenContainer>
            </ContentContainer>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
}));

const ContentContainer = styled('div')({
    paddingTop: HEADER_HEIGHT,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
});
const ChildrenContainer = styled('div')({ flex: 1, display: 'flex', flexDirection: 'column' });

export { AdminPage };
