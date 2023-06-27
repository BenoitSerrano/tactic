import React, { useState } from 'react';
import { Button, Modal, styled } from '@mui/material';
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
            <div>
                Complétez les phrases suivantes. Conjuguez le verbe ou ajoutez l’élément grammatical
                qui manque. Un seul objectif : trouver le cours le plus utile pour vous ! Chaque
                étudiant.e s’engage sur l’honneur à faire le test en 15 minutes maximum, sans
                utiliser aucun document et sans faire aucune recherche en ligne. Si vous ne savez
                pas, pas de stress : laissez juste la question en blanc.
            </div>
            <Button variant="contained" onClick={launchExam}>
                I have studied French (even at a basic level)
            </Button>
            <Button onClick={openModaleConfirmation}>I have never studied French</Button>
            <Modal open={isConfirmationModalOpen} onClose={closeConfirmationModal}>
                <ModalContent>
                    Do you confirm that you've never studied French?
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
    backgroundColor: 'white',
    borderRadius: '2px',
    width: '50%',
    height: '50%',
    margin: 'auto',
    top: '25%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px',
});
