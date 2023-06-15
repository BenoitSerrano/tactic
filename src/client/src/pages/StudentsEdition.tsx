import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

function StudentsEdition() {
    const queryClient = useQueryClient();
    const query = useQuery({ queryKey: ['students'], queryFn: api.fetchStudents });
    const [newStudentFirstName, setNewStudentFirstName] = useState('');
    const [newStudentLastName, setNewStudentLastName] = useState('');
    const mutation = useMutation({
        mutationFn: api.createStudent,
        onSuccess: () => {
            setNewStudentFirstName('');
            setNewStudentLastName('');
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });

    return (
        <div>
            <h1>Liste des étudiant.es créé.es</h1>
            <ul>
                {query.data?.map((student: any) => {
                    return (
                        <li key={student.id}>
                            {student.firstName} {student.lastName}
                        </li>
                    );
                })}
            </ul>
            <input
                value={newStudentFirstName}
                onChange={(event) => setNewStudentFirstName(event.target.value)}
            />
            <input
                value={newStudentLastName}
                onChange={(event) => setNewStudentLastName(event.target.value)}
            />
            <button onClick={createStudent}>Créer un.e étudiant.e</button>
        </div>
    );

    async function createStudent() {
        mutation.mutate({ firstName: newStudentFirstName, lastName: newStudentLastName });
    }
}

export { StudentsEdition };
