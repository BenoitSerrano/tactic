import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Button, TextField, Typography, styled } from '@mui/material';
import { Page } from '../components/Page';
import { useQuery } from '@tanstack/react-query';

function StudentAuthentication() {
    const params = useParams();
    const examId = params.examId as string;
    const query = useQuery(['exams', examId], () => api.fetchExam(examId));

    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    return (
        <Page>
            <TitleContainer>
                <img
                    width={100}
                    src="https://www.sorbonne.fr/wp-content/uploads/ENS_Logo_TL.jpg"
                    alt="Logo de l'ENS"
                />
                {query.data && <Typography variant="h4">{query.data.name}</Typography>}
            </TitleContainer>
            <ContentContainer>
                <TextField
                    label="Adresse e-mail"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <Button variant="contained" onClick={login} disabled={!email}>
                    Se connecter
                </Button>
            </ContentContainer>
        </Page>
    );

    async function login() {
        try {
            const studentId = await getStudentId(email);
            navigate(`/student/exams/${examId}/students/${studentId}`);
        } catch (error) {
            console.warn(error);
            alert(
                `L'email "${email}" n'existe pas pour cet examen. Veuillez renseigner l'email utilisé lors de vos échanges avec votre professeur.`,
            );
        }
    }

    async function getStudentId(email: string) {
        const result = await api.fetchStudentId(email.trim().toLowerCase());
        return result.id;
    }
}

const TitleContainer = styled('div')({
    marginBottom: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
});

const ContentContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export { StudentAuthentication };
