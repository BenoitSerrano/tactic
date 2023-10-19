import React, { useState } from 'react';
import { Typography, styled } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { questionType } from './types';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { QuestionAnswering } from './QuestionAnswering';

type questionAnswerType = Record<number, string>;

function QuestionsAnswering(props: {
    attemptId: string;
    title: string;
    questions: Array<questionType>;
    onExamDone: () => void;
}) {
    const saveDraftMutation = useMutation({
        mutationFn: api.updateAttempt,
        onSuccess: () => {
            displayAlert({ variant: 'success', text: 'Vos réponses ont bien été sauvegardées.' });
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const finishExamMutation = useMutation({
        mutationFn: api.updateAttempt,
        onSuccess: () => {
            props.onExamDone();
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const { displayAlert } = useAlert();

    const initialCurrentAnswers = props.questions.reduce((acc, question) => {
        return { ...acc, [question.id]: question.currentAnswer || '' };
    }, {} as questionAnswerType);

    const [currentAnswers, setCurrentAnswers] = useState(initialCurrentAnswers);

    return (
        <>
            <Container>
                <TitleContainer>
                    <Typography variant="h1">{props.title}</Typography>
                </TitleContainer>

                {props.questions.map((question, index) => (
                    <QuestionContainer key={`question-${question.id}`}>
                        <QuestionAnswering
                            currentAnswer={currentAnswers[question.id]}
                            setCurrentAnswer={(newAnswer: string) =>
                                setCurrentAnswers({ ...currentAnswers, [question.id]: newAnswer })
                            }
                            question={question}
                            index={index + 1}
                        />
                    </QuestionContainer>
                ))}
            </Container>
            <ButtonContainer>
                <LoadingButton loading={saveDraftMutation.isLoading} onClick={saveDraft}>
                    Enregistrer le brouillon
                </LoadingButton>
                <LoadingButton
                    loading={finishExamMutation.isLoading}
                    variant="contained"
                    onClick={finishExam}
                >
                    Valider les réponses
                </LoadingButton>
            </ButtonContainer>
        </>
    );

    function saveDraft() {
        saveDraftMutation.mutate({
            attemptId: props.attemptId,
            answers: currentAnswers,
        });
    }

    function finishExam() {
        finishExamMutation.mutate({
            attemptId: props.attemptId,
            answers: currentAnswers,
        });
    }
}

const BUTTON_CONTAINER_HEIGHT = 50;

const TitleContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
});

const Container = styled('div')({
    marginBottom: BUTTON_CONTAINER_HEIGHT,
    width: '100%',
    border: 'solid black 1px',
    boxShadow: '2px 2px 2px -1px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
});
const ButtonContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: BUTTON_CONTAINER_HEIGHT,
    backgroundColor: 'white',
    position: 'fixed',
    width: '100%',
    bottom: 0,
});

const QuestionContainer = styled('div')({ marginTop: 30, marginBottom: 30 });

export { QuestionsAnswering };
