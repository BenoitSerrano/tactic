import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import {
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { authentication } from '../lib/authentication';
import { config } from '../config';

function Exams() {
    const query = useQuery({ queryKey: ['exams'], queryFn: api.fetchExams });
    const navigate = useNavigate();
    const [newExamName, setNewExamName] = useState('');
    const [newExamDuration, setNewExamDuration] = useState(15);
    const mutation = useMutation({
        mutationFn: api.createExam,
        onSuccess: (exam) => {
            navigate(`/teacher/${authentication.getEncodedPassword()}/exams/${exam.id}/edit`);
        },
    });

    return (
        <div>
            <Typography variant="h1">Examens</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nom de l'examen</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {query.data?.map((exam: any) => (
                        <TableRow key={exam.id}>
                            <TableCell>{exam.name}</TableCell>
                            <TableCell>
                                <IconButton
                                    title="Editer"
                                    onClick={buildNavigateToEdition(exam.id)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    title="Voir les copies des étudiant.es"
                                    onClick={buildNavigateToResults(exam.id)}
                                >
                                    <RateReviewIcon />
                                </IconButton>
                                <IconButton
                                    title="Copier le lien à partager aux étudiant.es"
                                    onClick={buildCopyExamLinkToClipboard(exam.id)}
                                >
                                    <ContentCopyIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <hr />
            <TextField
                label="Nom de l'examen"
                placeholder="..."
                value={newExamName}
                onChange={(event) => setNewExamName(event.target.value)}
            />
            <TextField
                type="number"
                label="Durée de l'examen en minutes"
                placeholder="..."
                value={newExamDuration}
                onChange={(event) => setNewExamDuration(Number(event.target.value))}
            />
            <Button variant="contained" onClick={createExam}>
                Créer un examen
            </Button>
            <hr />
            <Link to={`/teacher/${authentication.getEncodedPassword()}`}>Revenir à l'accueil</Link>
        </div>
    );

    async function createExam() {
        mutation.mutate({ name: newExamName, duration: newExamDuration });
    }

    function buildNavigateToEdition(examId: string) {
        return () =>
            navigate(`/teacher/${authentication.getEncodedPassword()}/exams/${examId}/edit`);
    }

    function buildNavigateToResults(examId: string) {
        return () =>
            navigate(`/teacher/${authentication.getEncodedPassword()}/exams/${examId}/results`);
    }

    function buildCopyExamLinkToClipboard(examId: string) {
        return () => {
            const url = `${config.HOST_URL}/student/exams/${examId}`;
            navigator.clipboard.writeText(url);
        };
    }
}

export { Exams };
