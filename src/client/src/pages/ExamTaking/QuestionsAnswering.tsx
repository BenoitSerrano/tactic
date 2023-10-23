import React, { useState } from 'react';
import { styled } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { questionWithoutAnswer } from './types';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { QuestionAnswering } from './QuestionAnswering';
import { TestPageLayout } from '../../components/TestPageLayout';

type questionAnswerType = Record<number, string>;

function QuestionsAnswering(props: {
    attemptId: string;
    title: string;
    questions: Array<questionWithoutAnswer>;
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
            <TestPageLayout
                title={props.title}
                buttons={[
                    <LoadingButton
                        key="safe-draft-button"
                        loading={saveDraftMutation.isLoading}
                        onClick={saveDraft}
                    >
                        Enregistrer le brouillon
                    </LoadingButton>,
                    <LoadingButton
                        key="finish-exam-button"
                        loading={finishExamMutation.isLoading}
                        variant="contained"
                        onClick={finishExam}
                    >
                        Valider les réponses
                    </LoadingButton>,
                ]}
            >
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
            </TestPageLayout>
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

const QuestionContainer = styled('div')(({ theme }) => ({
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

export { QuestionsAnswering };
