import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authentication } from '../lib/authentication';
import { Page } from '../components/Page';

function TeacherLogin() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    return (
        <Page>
            <TextField
                label="Mot de passe"
                placeholder="..."
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <Button variant="contained" onClick={onClick}>
                Se connecter
            </Button>
        </Page>
    );

    function onClick() {
        if (authentication.isPasswordValid(password)) {
            navigate(`/teacher/${authentication.getEncodedPassword()}`);
        }
    }
}

export { TeacherLogin };
