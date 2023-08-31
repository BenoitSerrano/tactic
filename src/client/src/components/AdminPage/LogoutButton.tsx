import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { localStorage } from '../../lib/localStorage';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();
    return (
        <Tooltip title="Se déconnecter">
            <IconButton onClick={onClick} size="large">
                <LogoutIcon fontSize="large" />
            </IconButton>
        </Tooltip>
    );

    function onClick() {
        localStorage.jwtTokenHandler.remove();
        navigate('/sign-in');
    }
}

export { LogoutButton };
