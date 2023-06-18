import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

function StudentsEdition() {
    const queryClient = useQueryClient();
    const query = useQuery({ queryKey: ['students'], queryFn: api.fetchStudents });
    const [newEmail, setNewEmail] = useState('');
    const mutation = useMutation({
        mutationFn: api.createStudent,
        onSuccess: () => {
            setNewEmail('');
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
            <input value={newEmail} onChange={(event) => setNewEmail(event.target.value)} />
            <button onClick={createStudent}>Créer un.e étudiant.e</button>
        </div>
    );

    async function createStudent() {
        mutation.mutate(newEmail);
    }
}

export { StudentsEdition };
