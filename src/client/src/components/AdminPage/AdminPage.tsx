import { styled } from '@mui/material';
import { localStorage } from '../../lib/localStorage';
import { Navigate } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';
import { Header } from '../Header';
import { LogoutButton } from './LogoutButton';

function AdminPage(props: { children: React.ReactNode | null }) {
    const token = localStorage.jwtTokenHandler.get();
    if (!token) {
        return <Navigate to="/sign-in" />;
    }
    return (
        <Container>
            <Header buttons={[<LogoutButton />]} logoLink="/teacher" />
            <Breadcrumbs />
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

export { AdminPage };
