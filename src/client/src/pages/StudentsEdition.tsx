import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';

function StudentsEdition() {
    const queryClient = useQueryClient();
    const query = useQuery({ queryKey: ['students'], queryFn: api.fetchStudents });
    const [newEmail, setNewEmail] = useState('');
    const [emailList, setEmailList] = useState('');
    const createStudentMutation = useMutation({
        mutationFn: api.createStudent,
        onSuccess: () => {
            setNewEmail('');
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });

    const createStudentsMutation = useMutation({
        mutationFn: api.createStudents,
        onSuccess: () => {
            setEmailList('');
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });

    return (
        <div>
            <h1>Liste des étudiant.es créé.es</h1>
            <ul>
                {query.data?.map((student: any) => {
                    return <li key={student.id}>{student.email}</li>;
                })}
            </ul>
            <hr />
            <div>
                <form onSubmit={createStudent}>
                    <input value={newEmail} onChange={(event) => setNewEmail(event.target.value)} />
                    <button type="submit">Créer un.e étudiant.e</button>
                </form>
            </div>
            <hr />
            <div>
                <form onSubmit={importStudentEmails}>
                    <textarea
                        value={emailList}
                        onChange={(event) => setEmailList(event.target.value)}
                    />
                    <button type="submit">Importer une liste d'étudiant.es</button>
                </form>
            </div>
            <hr />
            <Link to="/teacher">Revenir à l'accueil</Link>
        </div>
    );

    async function createStudent() {
        createStudentMutation.mutate(newEmail.trim().toLowerCase());
    }

    async function importStudentEmails() {
        const emails: string[] = emailList
            .split('\n')
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean);
        createStudentsMutation.mutate(emails);
    }
}

export { StudentsEdition };
