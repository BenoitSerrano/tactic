import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { QuestionChoixMultipleChecking } from './QuestionChoixMultipleChecking';
import { QuestionTrouChecking } from './QuestionTrouChecking';
import { Typography, styled } from '@mui/material';
import { Page } from '../../components/Page';
import { PhraseMelangeeChecking } from './PhraseMelangeeChecking';

function ExamChecking() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const query = useQuery(['attempts', attemptId], () => api.fetchAttempt(attemptId));

    return !!query.data ? (
        <Page>
            <MainContainer>
                <Typography variant="h1">{query.data.exam.name}</Typography>
                {query.data.exam.questionsChoixMultiple.map(
                    (questionChoixMultiple: any, index: number) => (
                        <QuestionChoixMultipleChecking
                            key={questionChoixMultiple.id}
                            attemptId={attemptId}
                            index={index}
                            questionChoixMultiple={questionChoixMultiple}
                        />
                    ),
                )}
                <hr />
                {query.data.exam.questionsTrou.map((questionTrou: any, index: number) => (
                    <QuestionTrouChecking
                        key={questionTrou.id}
                        attemptId={attemptId}
                        index={index}
                        questionTrou={questionTrou}
                    />
                ))}

                {query.data.exam.phrasesMelangees.map((phraseMelangee: any, index: number) => (
                    <PhraseMelangeeChecking
                        key={`phraseMelangee-${phraseMelangee.id}`}
                        attemptId={attemptId}
                        index={index}
                        phraseMelangee={phraseMelangee}
                    />
                ))}
            </MainContainer>
        </Page>
    ) : (
        <div />
    );
}

const MainContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '60%',
});

export { ExamChecking };
