import { useState } from 'react';
import { Typography, styled } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { api } from '../../../lib/api';
import { useAlert } from '../../../lib/alert';
import { QuestionAnswering } from '../components/QuestionAnswering';
import { TestPageLayout } from '../components/TestPageLayout';
import { exerciseWithoutAnswersType } from '../types';
import { ExerciseContainer } from '../components/ExerciseContainer';

type questionAnswerType = Record<number, string>;

function QuestionsAnswering(props: {
    attemptId: string;
    title: string;
    studentEmail: string;
    exercises: Array<exerciseWithoutAnswersType>;
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
        mutationFn: async ({ attemptId }: { attemptId: string }) => {
            await api.updateAttempt({ attemptId, answers: currentAnswers });
            return api.updateEndedAt({ attemptId });
        },
        onSuccess: () => {
            props.onExamDone();
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const { displayAlert } = useAlert();

    const initialCurrentAnswers: questionAnswerType = {};
    for (const exercise of props.exercises) {
        for (const question of exercise.questions) {
            initialCurrentAnswers[question.id] = question.currentAnswer;
        }
    }

    const [currentAnswers, setCurrentAnswers] = useState(initialCurrentAnswers);

    return (
        <>
            <TestPageLayout
                studentEmail={props.studentEmail}
                title={props.title}
                buttons={[
                    <LoadingButton
                        key="safe-draft-button"
                        loading={saveDraftMutation.isPending}
                        onClick={saveDraft}
                    >
                        Enregistrer le brouillon
                    </LoadingButton>,
                    <LoadingButton
                        key="finish-exam-button"
                        loading={finishExamMutation.isPending}
                        variant="contained"
                        onClick={finishExam}
                    >
                        Valider les réponses
                    </LoadingButton>,
                ]}
            >
                {props.exercises.map((exercise) => (
                    <ExerciseContainer key={`exercise-${exercise.id}`} exercise={exercise}>
                        {exercise.questions.map((question, index) => (
                            <QuestionContainer key={`question-${question.id}`}>
                                <QuestionIndicatorsContainer>
                                    <Typography>/ {question.points}</Typography>
                                </QuestionIndicatorsContainer>
                                <QuestionAnswering
                                    currentAnswer={currentAnswers[question.id]}
                                    setCurrentAnswer={(newAnswer: string) =>
                                        setCurrentAnswers({
                                            ...currentAnswers,
                                            [question.id]: newAnswer,
                                        })
                                    }
                                    question={question}
                                    index={index + 1}
                                />
                            </QuestionContainer>
                        ))}
                    </ExerciseContainer>
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
        // eslint-disable-next-line no-restricted-globals
        const hasConfirmed = confirm(
            "Souhaitez-vous valider vos réponses et mettre fin à l'examen ? Vous ne pourrez plus revenir en arrière et modifier vos réponses.",
        );
        if (hasConfirmed) {
            finishExamMutation.mutate({ attemptId: props.attemptId });
        } else {
            saveDraftMutation.mutate({
                attemptId: props.attemptId,
                answers: currentAnswers,
            });
        }
    }
}

const QuestionIndicatorsContainer = styled('div')({
    minWidth: 80,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const QuestionContainer = styled('div')(({ theme }) => ({
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    display: 'flex',
}));

export { QuestionsAnswering };
