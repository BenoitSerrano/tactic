import { useState } from 'react';
import { Typography, styled } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { api } from '../../../lib/api';
import { useAlert } from '../../../lib/alert';
import { QuestionAnswering } from '../components/QuestionAnswering';
import { TestPageLayout } from '../components/TestPageLayout';
import { exerciseWithoutAnswersType, attemptAnswersType } from '../types';
import { ExerciseContainer } from '../components/ExerciseContainer';
import { computeExerciseProgress } from '../lib/computeExerciseProgress';
import { Modal } from '../../../components/Modal';
import { computeTotalPoints } from '../lib/computeTotalPoints';
import { QuestionContainer } from '../components/QuestionContainer';
import { HorizontalDivider } from '../../../components/HorizontalDivider';
import { LastUpdatedAtIndication } from './LastUpdatedAtIndication';

function QuestionsAnswering(props: {
    lastUpdatedAt: string | undefined;
    attemptId: string;
    title: string;
    studentEmail: string;
    exercises: Array<exerciseWithoutAnswersType>;
    onExamDone: () => void;
}) {
    const [isConfirmFinishExamModalOpen, setIsConfirmFinishExamModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const saveDraftMutation = useMutation({
        mutationFn: api.updateAttempt,
        retry: 2,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['attempts-without-answers', props.attemptId],
            });
        },
        onError: (error: any) => {
            displayAlert({
                variant: 'error',
                autoHideDuration: 5000,
                text: `Une erreur est survenue lors de l'enregistrement de vos réponses. `,
            });
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

    const initialCurrentAnswers: attemptAnswersType = {};
    for (const exercise of props.exercises) {
        for (const question of exercise.questions) {
            initialCurrentAnswers[question.id] = question.currentAnswer;
        }
    }
    const [currentExerciseExpanded, setCurrentExerciseExpanded] = useState<number | undefined>();

    const [currentAnswers, setCurrentAnswers] = useState(initialCurrentAnswers);
    const totalResult = computeTotalPoints(props.exercises);

    return (
        <>
            <TestPageLayout
                shouldPreventTextSelection
                highlightedResult={totalResult}
                studentEmail={props.studentEmail}
                title={props.title}
                leftElement={
                    <LastUpdatedAtIndication
                        lastUpdatedAt={props.lastUpdatedAt}
                        isLoading={saveDraftMutation.isPending}
                        onClick={() => saveDraft(currentAnswers)}
                    />
                }
                rightButtons={[
                    <LoadingButton
                        key="finish-exam-button"
                        variant="contained"
                        onClick={openConfirmFinishExamModal}
                    >
                        Terminer l'examen
                    </LoadingButton>,
                ]}
            >
                {props.exercises.map((exercise, exerciseIndex) => {
                    const progress = computeExerciseProgress(exercise.questions, currentAnswers);
                    const exerciseIndication = {
                        progress,
                        hideMark: true,
                    };
                    const isLastExercise = exerciseIndex === props.exercises.length - 1;

                    return (
                        <>
                            <ExerciseContainer
                                isExpanded={currentExerciseExpanded === exercise.id}
                                onChangeExpanded={buildOnExerciseExpandedChange(exercise.id)}
                                key={`exercise-${exercise.id}`}
                                exercise={exercise}
                                indication={exerciseIndication}
                            >
                                {exercise.questions.map((question, index) => {
                                    const isLastQuestion = index === exercise.questions.length - 1;
                                    return (
                                        <>
                                            <QuestionContainer key={`question-${question.id}`}>
                                                <QuestionIndicatorsContainer>
                                                    <Typography>/ {question.points}</Typography>
                                                </QuestionIndicatorsContainer>
                                                <QuestionAnswering
                                                    currentAnswer={currentAnswers[question.id]}
                                                    setCurrentAnswer={buildSetCurrentAnswersAndSave(
                                                        question.id,
                                                    )}
                                                    question={question}
                                                    index={index + 1}
                                                />
                                            </QuestionContainer>
                                            {!isLastQuestion && <HorizontalDivider />}
                                        </>
                                    );
                                })}
                            </ExerciseContainer>
                            {!isLastExercise && <HorizontalDivider />}
                        </>
                    );
                })}
            </TestPageLayout>
            <Modal
                size="small"
                isOpen={isConfirmFinishExamModalOpen}
                close={closeConfirmFinishExamModal}
                onConfirm={finishExam}
                onCancel={cancelFinishExamModal}
                isConfirmLoading={finishExamMutation.isPending}
                title="Terminer l'examen ?"
            >
                <>
                    <Typography>
                        Souhaitez-vous valider vos réponses et mettre fin à l'examen ?
                    </Typography>
                    <Typography>
                        Vous ne pourrez plus revenir en arrière et modifier vos réponses.
                    </Typography>
                </>
            </Modal>
        </>
    );

    function closeConfirmFinishExamModal() {
        setIsConfirmFinishExamModalOpen(false);
    }
    function openConfirmFinishExamModal() {
        setIsConfirmFinishExamModalOpen(true);
    }

    function cancelFinishExamModal() {
        closeConfirmFinishExamModal();
        saveDraft(currentAnswers);
    }

    function buildSetCurrentAnswersAndSave(questionId: number) {
        return (newAnswer: string) => {
            const newCurrentAnswers = {
                ...currentAnswers,
                [questionId]: newAnswer,
            };
            setCurrentAnswers(newCurrentAnswers);
            saveDraft(newCurrentAnswers);
        };
    }

    function finishExam() {
        closeConfirmFinishExamModal();
        finishExamMutation.mutate({ attemptId: props.attemptId });
    }

    function saveDraft(newCurrentAnswers: attemptAnswersType) {
        saveDraftMutation.mutate({
            attemptId: props.attemptId,
            answers: newCurrentAnswers,
        });
    }

    function buildOnExerciseExpandedChange(exerciseId: number) {
        return (_: any, isExpanded: boolean) => {
            setCurrentExerciseExpanded(isExpanded ? exerciseId : undefined);
        };
    }
}

const QuestionIndicatorsContainer = styled('div')({
    minWidth: 80,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export { QuestionsAnswering };
