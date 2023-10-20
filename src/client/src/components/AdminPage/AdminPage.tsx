import { styled } from '@mui/material';
import { AdminHeader } from './AdminHeader';
import { localStorage } from '../../lib/localStorage';
import { Navigate } from 'react-router-dom';

function AdminPage(props: { children: React.ReactNode | null }) {
    const token = localStorage.jwtTokenHandler.get();
    if (!token) {
        return <Navigate to="/sign-in" />;
    }
    return (
        <Container>
            <AdminHeader />
            {props.children}
        </Container>
    );
}

const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
});

export { AdminPage };
