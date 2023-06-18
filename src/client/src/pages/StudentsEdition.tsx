import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

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
            <div>
                <input value={newEmail} onChange={(event) => setNewEmail(event.target.value)} />
                <button onClick={createStudent}>Créer un.e étudiant.e</button>
            </div>
            <div>
                <textarea
                    value={emailList}
                    onChange={(event) => setEmailList(event.target.value)}
                />
                <button onClick={importStudentEmails}>Importer une liste d'étudiant.es</button>
            </div>
        </div>
    );

    async function createStudent() {
        createStudentMutation.mutate(newEmail);
    }

    async function importStudentEmails() {
        const emails: string[] = emailList.split('\n');
        createStudentsMutation.mutate(emails);
    }
}

export { StudentsEdition };
