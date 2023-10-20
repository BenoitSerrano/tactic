import { styled } from '@mui/material';
import { AdminHeader } from './AdminHeader';
import { localStorage } from '../../lib/localStorage';
import { Navigate } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';

function AdminPage(props: { children: React.ReactNode | null }) {
    const token = localStorage.jwtTokenHandler.get();
    if (!token) {
        return <Navigate to="/sign-in" />;
    }
    return (
        <Container>
            <AdminHeader />
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
