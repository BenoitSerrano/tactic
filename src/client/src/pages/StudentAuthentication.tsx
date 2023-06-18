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
            <input name="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <button onClick={launchExam}>Lancer l'examen</button>
        </div>
    );

    async function launchExam() {
        const studentId = await getStudentId(email);
        mutation.mutate({ examId, studentId });
    }

    async function getStudentId(email: string) {
        const { id } = await api.fetchStudentId(email);
        return id;
    }
}

export { StudentAuthentication };
