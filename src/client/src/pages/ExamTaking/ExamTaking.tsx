import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Typography, styled } from '@mui/material';
import { api } from '../../lib/api';
import { QuestionChoixMultipleAnswering } from './QuestionChoixMultipleAnswering';
import { Countdown } from '../../components/Countdown';
import { Page } from '../../components/Page';
import { time } from '../../lib/time';
import { QuestionTrouAnswering } from './QuestionTrouAnswering';
import { PhraseMelangeeAnswering } from './PhraseMelangeeAnswering';

function ExamTaking() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const studentId = params.studentId as string;
    const navigate = useNavigate();
    const query = useQuery(['attempts', attemptId], () => api.fetchAttempt(attemptId));

    if (!query.data) {
        return <div />;
    }

    let remainingSeconds =
        query.data.exam.duration * 60 - time.computeElapsedTime(query.data.startedAt, new Date());
    if (remainingSeconds + query.data.exam.extraTime * 60 < 0) {
        return <Navigate to="/student/attempt-timeout" />;
    }

    return (
        <Page>
            <MainContainer>
                <Typography variant="h1">{query.data.exam.name}</Typography>
                <CountdownContainer>
                    <Countdown remainingSeconds={remainingSeconds} />
                </CountdownContainer>
                {query.data.exam.questionsChoixMultiple.map(
                    (questionChoixMultiple: any, index: number) => (
                        <QuestionChoixMultipleAnswering
                            key={questionChoixMultiple.id}
                            attemptId={attemptId}
                            index={index}
                            questionChoixMultiple={questionChoixMultiple}
                        />
                    ),
                )}
                {query.data.exam.questionsTrou.length > 0 && (
                    <p>
                        <Typography variant="h2">
                            Complétez les phrases suivantes. Conjuguez le verbe ou ajoutez l’élément
                            grammatical qui manque. Si vous ne savez pas, pas de stress : laissez
                            juste la question en blanc.
                        </Typography>
                    </p>
                )}
                {query.data.exam.questionsTrou.map((questionTrou: any, index: number) => (
                    <QuestionTrouAnswering
                        key={questionTrou.id}
                        attemptId={attemptId}
                        index={index}
                        questionTrou={questionTrou}
                    />
                ))}
                {query.data.exam.phrasesMelangees.map((phraseMelangee: any, index: number) => (
                    <PhraseMelangeeAnswering
                        key={phraseMelangee.id}
                        attemptId={attemptId}
                        index={index}
                        phraseMelangee={phraseMelangee}
                    />
                ))}
                <hr />
                <Button variant="contained" onClick={validateForm}>
                    Valider le questionnaire
                </Button>
            </MainContainer>
        </Page>
    );

    function validateForm() {
        navigate(`/student/students/${studentId}/exam-done`);
    }
}

export { ExamTaking };

const CountdownContainer = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
});

const MainContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '60%',
});
