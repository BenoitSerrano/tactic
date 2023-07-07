import React, { useState } from 'react';
import { Button, Modal, Typography, styled } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Page } from '../components/Page';

function StudentHome() {
    const params = useParams();
    const studentId = params.studentId as string;
    const examId = params.examId as string;
    const navigate = useNavigate();
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

    const query = useQuery(['exams', examId, 'students', studentId, 'attempts'], () =>
        api.searchAttempt({ examId, studentId }),
    );

    const examQuery = useQuery(['exams', examId], () => api.fetchExam(examId));

    const createAttemptMutation = useMutation({
        mutationFn: api.createAttempt,
        onSuccess: (attempt: any) => {
            navigate(`/student/${studentId}/attempts/${attempt.id}`);
        },
    });

    const createEmptyAttemptMutation = useMutation({
        mutationFn: api.createEmptyAttempt,
        onSuccess: () => {
            navigate(`/student/empty-attempt-created`);
        },
    });

    if (!query.data) {
        return <div />;
    }

    if (query.data.length > 0) {
        navigate(`/student/${studentId}/attempts/${query.data[0].id}`);
        return <div />;
    }

    return (
        <Page>
            <img
                width={100}
                src="https://www.sorbonne.fr/wp-content/uploads/ENS_Logo_TL.jpg"
                alt="Logo de l'ENS"
            />
            {examQuery.data && <Typography variant="h4">{examQuery.data.name}</Typography>}
            <ContentContainer>
                <p>
                    <Typography>
                        L'objectif de ce test est de trouver le cours le plus adapté à votre niveau.
                        Chaque étudiant.e s’engage sur l’honneur à faire le test en 15 minutes
                        maximum, sans utiliser aucun document et sans faire aucune recherche en
                        ligne. Si vous ne savez pas, pas de stress : laissez juste la question en
                        blanc.
                    </Typography>
                </p>
                <p>
                    <Typography>
                        <em>
                            If you have studied French, even at a basic level or a long time ago,
                            you have to take the test. But if you have never studied French, click
                            on "I have never studied French" below!
                        </em>
                    </Typography>
                </p>
                <Button variant="contained" onClick={launchExam}>
                    Passer le test
                </Button>
                <Button onClick={openModaleConfirmation}>I have never studied French</Button>
            </ContentContainer>
            <Modal open={isConfirmationModalOpen} onClose={closeConfirmationModal}>
                <ModalContent>
                    <p>
                        <Typography>Do you confirm that you've never studied French?</Typography>
                    </p>
                    <div>
                        <Button onClick={closeConfirmationModal}>Cancel</Button>
                        <Button variant="contained" onClick={launchAndEndExam}>
                            Yes, I confirm
                        </Button>
                    </div>
                </ModalContent>
            </Modal>
        </Page>
    );

    function closeConfirmationModal() {
        setIsConfirmationModalOpen(false);
    }

    function openModaleConfirmation() {
        setIsConfirmationModalOpen(true);
    }

    function launchExam() {
        createAttemptMutation.mutate({ examId, studentId });
    }

    function launchAndEndExam() {
        closeConfirmationModal();
        createEmptyAttemptMutation.mutate({ examId, studentId });
    }
}

export { StudentHome };

const ModalContent = styled('div')({
    borderRadius: '2px',
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    height: '40%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'white',
});

const ContentContainer = styled('div')({
    width: '50%',
});
