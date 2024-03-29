import { useState } from 'react';
import { Typography, styled } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
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

function QuestionsAnswering(props: {
    attemptId: string;
    title: string;
    studentEmail: string;
    exercises: Array<exerciseWithoutAnswersType>;
    onExamDone: () => void;
}) {
    const [isConfirmFinishExamModalOpen, setIsConfirmFinishExamModalOpen] = useState(false);
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

    const initialCurrentAnswers: attemptAnswersType = {};
    for (const exercise of props.exercises) {
        for (const question of exercise.questions) {
            initialCurrentAnswers[question.id] = question.currentAnswer;
        }
    }
    const [currentExerciseExpanded, setCurrentExerciseExpanded] = useState<number | undefined>();

    const [currentAnswers, setCurrentAnswers] = useState(initialCurrentAnswers);
    const totalPoints = computeTotalPoints(props.exercises);

    return (
        <>
            <TestPageLayout
                shouldPreventTextSelection
                subtitle="Pensez à sauvegarder régulièrement vos réponses"
                result={totalPoints}
                studentEmail={props.studentEmail}
                title={props.title}
                centerButtons={[
                    <LoadingButton
                        key="safe-draft-button"
                        loading={saveDraftMutation.isPending}
                        onClick={saveDraft}
                        variant="outlined"
                    >
                        Sauvegarder vos réponses
                    </LoadingButton>,
                ]}
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
        saveDraft();
    }

    function finishExam() {
        finishExamMutation.mutate({ attemptId: props.attemptId });
    }

    function saveDraft() {
        saveDraftMutation.mutate({
            attemptId: props.attemptId,
            answers: currentAnswers,
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
