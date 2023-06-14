import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

function Exams() {
    const query = useQuery({ queryKey: ['exams'], queryFn: api.fetchExams });
    const navigate = useNavigate();
    const [newExamName, setNewExamName] = useState('');
    const mutation = useMutation({
        mutationFn: api.createExam,
        onSuccess: (exam) => {
            navigate(`/exams/${exam.id}/edit`);
        },
    });

    return (
        <div>
            <h1>Liste des examens créés</h1>
            <ul>
                {query.data?.map((exam: any) => {
                    return (
                        <li key={exam.id}>
                            {exam.name} : <Link to={`/exams/${exam.id}/edit`}>Editer</Link> |{' '}
                            <Link to={`/exams/${exam.id}/take`}>Commencer l'examen</Link>
                        </li>
                    );
                })}
            </ul>
            <input value={newExamName} onChange={(event) => setNewExamName(event.target.value)} />
            <button onClick={createExam}>Créer un examen</button>
        </div>
    );

    async function createExam() {
        mutation.mutate(newExamName);
    }
}

export { Exams };
