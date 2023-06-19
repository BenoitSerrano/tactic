import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';

function StudentAuthentication() {
    const params = useParams();
    const examId = params.examId as string;
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: api.findOrCreateAttempt,
        onSuccess: (attempt: any) => {
            navigate(`/student/attempts/${attempt.id}`);
        },
    });
    const [email, setEmail] = useState('');

    return (
        <div>
            <input
                placeholder="Adresse e-mail"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <button onClick={launchExam}>Lancer l'examen</button>
        </div>
    );

    async function launchExam() {
        const studentId = await getStudentId(email);
        mutation.mutate({ examId, studentId });
    }

    async function getStudentId(email: string) {
        try {
            const result = await api.fetchStudentId(email);
            console.log(result);
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
