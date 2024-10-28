import LogoutIcon from '@mui/icons-material/Logout';
import { localStorage } from '../../lib/localStorage';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import { pathHandler } from '../../lib/pathHandler';
import { styled } from '@mui/material';
import { IconButton } from '../IconButton';

function LogoutButton() {
    const navigate = useNavigate();
    const title = 'Se déconnecter';
    return (
        <>
            <FullButtonContainer>
                <Button
                    onClick={onClick}
                    variant="outlined"
                    startIcon={<LogoutIcon fontSize="large" />}
                >
                    {title}
                </Button>
            </FullButtonContainer>
            <IconButtonContainer>
                <IconButton IconComponent={LogoutIcon} title={title} onClick={onClick} />
            </IconButtonContainer>
        </>
    );

    function onClick() {
        localStorage.jwtTokenHandler.remove();
        navigate(pathHandler.getRoutePath('SIGN_IN'));
    }
}

const FullButtonContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));
const IconButtonContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('sm')]: {
        display: 'none',
    },
}));

export { LogoutButton };
