import { styled } from '@mui/material';
import { LogoutButton } from './LogoutButton';
import { Link } from '../Link';
import { Logo } from '../Logo';

const HEIGHT = 60;

function AdminHeader() {
    return (
        <Container>
            <Link to="/teacher">
                <Logo />
            </Link>
            <LogoutButton />
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: HEIGHT,
    backgroundColor: 'white',
    borderBottom: `${theme.palette.divider} 1px solid`,
}));

export { AdminHeader };
