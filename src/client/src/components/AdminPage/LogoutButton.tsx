import { Button } from '@mui/material';
import React from 'react';
import { localStorage } from '../../lib/localStorage';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();
    return <Button onClick={onClick}>Se déconnecter</Button>;

    function onClick() {
        localStorage.jwtTokenHandler.remove();
        navigate('/sign-in');
    }
}

export { LogoutButton };
