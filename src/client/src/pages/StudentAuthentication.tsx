import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Button, TextField, styled } from '@mui/material';

function StudentAuthentication() {
    const params = useParams();
    const examId = params.examId as string;
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    return (
        <Container>
            <ContentContainer>
                <TextField
                    placeholder="Adresse e-mail"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <Button variant="contained" onClick={login}>
                    Se connecter
                </Button>
            </ContentContainer>
        </Container>
    );

    async function login() {
        const studentId = await getStudentId(email);
        navigate(`/student/exams/${examId}/students/${studentId}`);
    }

    async function getStudentId(email: string) {
        try {
            const result = await api.fetchStudentId(email.trim().toLowerCase());
            return result.id;
        } catch (error) {
            console.warn(error);
            alert(
                `L'email "${email}" n'existe pas pour cet examen. Veuillez renseigner l'email utilisé lors de vos échanges avec votre professeur.`,
            );
        }
    }
}

const Container = styled('div')({
    display: 'flex',
    width: '100%',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
});

const ContentContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export { StudentAuthentication };
