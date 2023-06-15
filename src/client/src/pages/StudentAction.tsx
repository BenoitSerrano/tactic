import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';

function StudentAction() {
    const navigate = useNavigate();
    const params = useParams();
    const examId = params.examId as string;
    const studentId = params.studentId as string;
    const mutation = useMutation({
        mutationFn: api.createAttempt,
        onSuccess: (attempt: any) => {
            navigate(`/student/attempts/${attempt.id}`);
        },
    });

    return (
        <div>
            <button onClick={launchExam}>Lancer l'examen</button>
        </div>
    );

    function launchExam() {
        mutation.mutate({ examId, studentId });
    }
}

export { StudentAction };
