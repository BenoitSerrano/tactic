import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';

function StudentAuthentication() {
    const params = useParams();
    const examId = params.examId as string;
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    return (
        <div>
            <input
                placeholder="Adresse e-mail"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <button onClick={login}>Se connecter</button>
        </div>
    );

    async function login() {
        const studentId = await getStudentId(email);
        navigate(`/student/exams/${examId}/students/${studentId}`);
    }

    async function getStudentId(email: string) {
        try {
            const result = await api.fetchStudentId(email);
            return result.id;
        } catch (error) {
            console.warn(error);
            alert(
                `L'email "${email}" n'existe pas pour cet examen. Veuillez renseigner l'email utilisé lors de vos échanges avec votre professeur.`,
            );
        }
    }
}

export { StudentAuthentication };
