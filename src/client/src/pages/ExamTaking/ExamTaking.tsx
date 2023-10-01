import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Typography, styled } from '@mui/material';
import { Countdown } from '../../components/Countdown';
import { Page } from '../../components/Page';
import { time } from '../../lib/time';
import { Loader } from '../../components/Loader';
import { api } from '../../lib/api';
import { QuestionsAnswering } from './QuestionsAnswering';
import { attemptWithoutAnswersType } from './types';

function ExamTaking() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const studentId = params.studentId as string;
    const navigate = useNavigate();
    const query = useQuery<attemptWithoutAnswersType>(['attempts-without-answers', attemptId], () =>
        api.fetchAttemptWithoutAnswers(attemptId),
    );

    if (!query.data) {
        return (
            <Page>
                <Loader />
            </Page>
        );
    }

    const examDonePath = `/student/students/${studentId}/exam-done`;

    let remainingSeconds =
        query.data.exam.duration * 60 - time.computeElapsedTime(query.data.startedAt, new Date());
    if (remainingSeconds + query.data.exam.extraTime * 60 < 0) {
        return <Navigate to={examDonePath} />;
    }

    return (
        <Page>
            <MainContainer>
                <Typography variant="h1">{query.data.exam.name}</Typography>
                <CountdownContainer>
                    <Countdown remainingSeconds={remainingSeconds} />
                </CountdownContainer>
                <QuestionsAnswering
                    questionsChoixMultiple={query.data.exam.questionsChoixMultiple}
                    questionsTrou={query.data.exam.questionsTrou}
                    phrasesMelangees={query.data.exam.phrasesMelangees}
                    attemptId={attemptId}
                />

                <hr />
                <Button variant="contained" onClick={validateForm}>
                    Valider les réponses
                </Button>
            </MainContainer>
        </Page>
    );

    function validateForm() {
        navigate(examDonePath);
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
