import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

function Exams() {
    const query = useQuery({ queryKey: ['exams'], queryFn: api.fetchExams });
    const navigate = useNavigate();
    const [newExamName, setNewExamName] = useState('');
    const [newExamDuration, setNewExamDuration] = useState(15);
    const mutation = useMutation({
        mutationFn: api.createExam,
        onSuccess: (exam) => {
            navigate(`/teacher/exams/${exam.id}/edit`);
        },
    });

    return (
        <div>
            <h1>Liste des examens créés</h1>
            <ul>
                {query.data?.map((exam: any) => {
                    return (
                        <li key={exam.id}>
                            {exam.name} : <Link to={`/teacher/exams/${exam.id}/edit`}>Éditer</Link>{' '}
                            |{' '}
                            <Link to={`/teacher/exams/${exam.id}/results`}>Voir les résultats</Link>{' '}
                            |
                            <button onClick={buildCopyExamLinkToClipboard(exam.id)}>
                                Copier le lien vers l'examen à partager aux étudiant.es
                            </button>
                        </li>
                    );
                })}
            </ul>
            <hr />
            <input
                placeholder="Nom de l'examen"
                value={newExamName}
                onChange={(event) => setNewExamName(event.target.value)}
            />
            <input
                type="number"
                placeholder="Durée de l'examen en minutes"
                value={newExamDuration}
                onChange={(event) => setNewExamDuration(Number(event.target.value))}
            />
            <button onClick={createExam}>Créer un examen</button>
            <hr />
            <Link to="/teacher">Revenir à l'accueil</Link>
        </div>
    );

    async function createExam() {
        mutation.mutate({ name: newExamName, duration: newExamDuration });
    }

    function buildCopyExamLinkToClipboard(examId: string) {
        return () => {
            const url = `https://test-de-langue.osc-fr1.scalingo.io/student/exams/${examId}`;
            navigator.clipboard.writeText(url);
        };
    }
}

export { Exams };
