import React, { useState } from 'react';
import { Button, Typography, styled } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Page } from '../components/Page';
import { Modal } from '../components/Modal';

function StudentHome() {
    const params = useParams();
    const studentId = params.studentId as string;
    const examId = params.examId as string;
    const navigate = useNavigate();

    const query = useQuery(['exams', examId, 'students', studentId, 'attempts'], () =>
        api.searchAttempt({ examId, studentId }),
    );

    const examQuery = useQuery(['exams', examId], () => api.fetchExam(examId));

    const createAttemptMutation = useMutation({
        mutationFn: api.createAttempt,
        onSuccess: (attempt: any) => {
            navigate(`/student/students/${studentId}/attempts/${attempt.id}`);
        },
    });

    if (!query.data) {
        return <div />;
    }

    if (query.data.length > 0) {
        navigate(`/student/students/${studentId}/attempts/${query.data[0].id}`);
        return <div />;
    }

    return (
        <Page>
            {examQuery.data && <Typography variant="h4">{examQuery.data.name}</Typography>}
            <ContentContainer>
                <p>
                    <Typography>
                        L'objectif de ce test est de trouver le cours le plus adapté à votre niveau.
                        Vous vous engagez à n'utiliser aucun document et à ne faire aucune recherche
                        en ligne. Attention : vous n'aurez pas plus de 60 minutes pour faire ce test
                        (il y a un chronomètre). Si vous ne savez pas, pas de stress : laissez juste
                        la question en blanc.
                    </Typography>
                </p>

                <Button variant="contained" onClick={launchExam}>
                    Passer le test
                </Button>
            </ContentContainer>
        </Page>
    );

    function launchExam() {
        createAttemptMutation.mutate({ examId, studentId });
    }
}

export { StudentHome };

const ContentContainer = styled('div')({
    width: '50%',
    // dislay: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
});
