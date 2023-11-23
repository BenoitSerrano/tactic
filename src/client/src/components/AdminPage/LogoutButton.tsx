import LogoutIcon from '@mui/icons-material/Logout';
import { localStorage } from '../../lib/localStorage';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import { pathHandler } from '../../lib/pathHandler';

function LogoutButton() {
    const navigate = useNavigate();
    return (
        <Button onClick={onClick} variant="outlined" startIcon={<LogoutIcon fontSize="large" />}>
            Se déconnecter
        </Button>
    );

    function onClick() {
        localStorage.jwtTokenHandler.remove();
        navigate(pathHandler.getRoutePath('SIGN_IN'));
    }
}

export { LogoutButton };
