import { Fragment, useEffect, useState } from 'react';
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
import { computeTotalPoints } from '../lib/computeTotalPoints';
import { QuestionContainer } from '../components/QuestionContainer';
import { HorizontalDivider } from '../../../components/HorizontalDivider';
import { LastUpdatedAtIndication } from './LastUpdatedAtIndication';
import { useExerciseIndex } from '../lib/useExerciseIndex';
import { EmptyExam } from '../components/EmptyExam';
import { ExercisesSummary } from '../components/ExercisesSummary';
import { FinishExamModal } from './FinishExamModal';

const DELAY_BETWEEN_SHOWING_ALERT_AND_END_OF_EXAM = 30 * 1000;

function QuestionsAnswering(props: {
    lastUpdatedAt: string | undefined;
    attemptId: string;
    title: string;
    remainingTime: number;
    studentEmail: string;
    exercises: Array<exerciseWithoutAnswersType>;
    onExamDone: () => void;
}) {
    const [isConfirmFinishExamModalOpen, setIsConfirmFinishExamModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [remainingTimeTimeout, setRemainingTimeTimeout] = useState<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (props.remainingTime === Infinity || props.remainingTime < 0) {
            return;
        }
        const remainingTimeAlertMessage =
            "Attention, il vous reste moins de 30 secondes. Veuillez sauvegarder vos réponses et terminer l'examen.";

        if (props.remainingTime < DELAY_BETWEEN_SHOWING_ALERT_AND_END_OF_EXAM) {
            alert(remainingTimeAlertMessage);
            return;
        }
        if (props.remainingTime !== Infinity) {
            const remainingTimeBeforeShowingAlert =
                props.remainingTime - DELAY_BETWEEN_SHOWING_ALERT_AND_END_OF_EXAM;
            const newRemainingTimeTimeout = setTimeout(
                () => alert(remainingTimeAlertMessage),
                remainingTimeBeforeShowingAlert,
            );
            setRemainingTimeTimeout(newRemainingTimeTimeout);
        }
    }, []);
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

    const [currentAnswers, setCurrentAnswers] = useState(initialCurrentAnswers);
    const totalResult = computeTotalPoints(props.exercises);

    const exerciseIndexes = useExerciseIndex(props.exercises);
    const currentExerciseIndex = exerciseIndexes.current;

    const exercise =
        currentExerciseIndex !== undefined ? props.exercises[currentExerciseIndex] : undefined;
    if (currentExerciseIndex === undefined || !exercise) {
        return <EmptyExam title={props.title} />;
    }
    const progresses = props.exercises.map((exercise) =>
        computeExerciseProgress(exercise.questions, currentAnswers),
    );
    const progress = progresses[currentExerciseIndex];

    const exerciseIndication = {
        progress,
        hideMark: true,
    };

    return (
        <>
            <ExercisesSummary progresses={progresses} currentExerciseIndex={currentExerciseIndex} />
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
                <Fragment key={`exercise-${exercise.id}`}>
                    <ExerciseContainer
                        currentExerciseIndex={currentExerciseIndex}
                        exerciseIndexes={exerciseIndexes}
                        exercise={exercise}
                        indication={exerciseIndication}
                    >
                        {exercise.questions.map((question, index) => {
                            const isLastQuestion = index === exercise.questions.length - 1;
                            return (
                                <Fragment key={`question-${question.id}`}>
                                    <QuestionContainer>
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
                                </Fragment>
                            );
                        })}
                    </ExerciseContainer>
                </Fragment>
            </TestPageLayout>
            <FinishExamModal
                progresses={progresses}
                close={closeConfirmFinishExamModal}
                isConfirmLoading={finishExamMutation.isPending}
                isOpen={isConfirmFinishExamModalOpen}
                onCancel={cancelFinishExamModal}
                onConfirm={finishExam}
            />
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
        if (remainingTimeTimeout) {
            clearTimeout(remainingTimeTimeout);
        }
        closeConfirmFinishExamModal();
        finishExamMutation.mutate({ attemptId: props.attemptId });
    }

    function saveDraft(newCurrentAnswers: attemptAnswersType) {
        saveDraftMutation.mutate({
            attemptId: props.attemptId,
            answers: newCurrentAnswers,
        });
    }
}

const QuestionIndicatorsContainer = styled('div')({
    minWidth: 80,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export { QuestionsAnswering };
