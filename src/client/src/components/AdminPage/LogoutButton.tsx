import React from 'react';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { localStorage } from '../../lib/localStorage';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();
    return (
        <IconButton title="Se déconnecter" onClick={onClick} size="large">
            <LogoutIcon fontSize="large" />
        </IconButton>
    );

    function onClick() {
        localStorage.jwtTokenHandler.remove();
        navigate('/sign-in');
    }
}

export { LogoutButton };
