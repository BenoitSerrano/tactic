import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';

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
            <Typography variant="h1">Liste des étudiant.es créé.es</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Adresse e-mail</TableCell>
                        <TableCell>Commentaire</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {query.data?.map((student: any) => (
                        <TableRow key={student.id}>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.comment}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <hr />
            <div>
                <TextField value={newEmail} onChange={(event) => setNewEmail(event.target.value)} />
                <Button onClick={createStudent}>Créer un.e étudiant.e</Button>
            </div>
            <hr />
            <div>
                <TextField
                    multiline
                    value={emailList}
                    onChange={(event) => setEmailList(event.target.value)}
                />
                <Button onClick={importStudentEmails}>Importer une liste d'étudiant.es</Button>
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
