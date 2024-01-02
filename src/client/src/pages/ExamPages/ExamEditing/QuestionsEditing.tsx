import { TestPageLayout } from '../components/TestPageLayout';
import { useState } from 'react';
import { ExerciseContainer } from '../components/ExerciseContainer';
import { computeTotalPoints } from '../lib/computeTotalPoints';
import {
    exerciseUpsertionModalStatusType,
    exerciseWithQuestionsType,
    questionUpsertionModalStatusType,
} from './types';
import {
    HorizontalDividerToAddExercise,
    HorizontalDividerToAddQuestion,
} from './HorizontalDividers';
import { ExerciseUpsertionModal } from './ExerciseUpsertionModal';
import { computeOrderForIndex } from './lib/computeOrderForIndex';
import { QuestionUpsertionModal } from './QuestionUpsertionModal/QuestionUpsertionModal';
import { QuestionViewMode } from './QuestionViewMode/QuestionViewMode';

function QuestionsEditing(props: {
    title: string;
    examId: string;
    exercises: Array<exerciseWithQuestionsType>;
}) {
    const [currentExerciseExpanded, setCurrentExerciseExpanded] = useState<number | undefined>(
        undefined,
    );
    const [exerciseUpsertionModalStatus, setExerciseUpsertionModalStatus] = useState<
        exerciseUpsertionModalStatusType | undefined
    >(undefined);
    const [questionUpsertionModalStatus, setQuestionUpsertionModalStatus] = useState<
        questionUpsertionModalStatusType | undefined
    >(undefined);
    const totalPoints = computeTotalPoints(props.exercises);

    return (
        <>
            <TestPageLayout studentEmail="-" title={props.title} result={totalPoints}>
                <HorizontalDividerToAddExercise onClick={buildOpenExerciseCreationModal(-1)} />

                {props.exercises.map((exercise, exerciseIndex) => {
                    const exerciseIndication = { hideMark: true };

                    return (
                        <>
                            <ExerciseContainer
                                isExpanded={currentExerciseExpanded === exercise.id}
                                onChangeExpanded={buildOnExerciseExpandedChange(exercise.id)}
                                key={`exercise-${exercise.id}`}
                                exercise={exercise}
                                indication={exerciseIndication}
                            >
                                <HorizontalDividerToAddQuestion
                                    onClick={buildOpenQuestionCreationModal(-1, exercise)}
                                />
                                {exercise.questions.map((question, index) => (
                                    <>
                                        <QuestionViewMode
                                            question={question}
                                            index={index + 1}
                                            examId={props.examId}
                                            exerciseId={exercise.id}
                                        />
                                        <HorizontalDividerToAddQuestion
                                            onClick={buildOpenQuestionCreationModal(-1, exercise)}
                                        />
                                    </>
                                ))}
                            </ExerciseContainer>
                            <HorizontalDividerToAddExercise
                                onClick={buildOpenExerciseCreationModal(exerciseIndex)}
                            />
                        </>
                    );
                })}
            </TestPageLayout>
            {!!exerciseUpsertionModalStatus && (
                <ExerciseUpsertionModal
                    examId={props.examId}
                    close={closeExerciseUpsertionModal}
                    modalStatus={exerciseUpsertionModalStatus}
                />
            )}
            {!!questionUpsertionModalStatus && (
                <QuestionUpsertionModal
                    examId={props.examId}
                    close={closeQuestionUpsertionModal}
                    modalStatus={questionUpsertionModalStatus}
                    defaultPoints={questionUpsertionModalStatus.exercise.defaultPoints}
                    defaultQuestionKind={questionUpsertionModalStatus.exercise.defaultQuestionKind}
                    exerciseId={questionUpsertionModalStatus.exercise.id}
                />
            )}
        </>
    );

    function buildOpenQuestionCreationModal(
        currentQuestionIndex: number,
        exercise: exerciseWithQuestionsType,
    ) {
        const order = computeOrderForIndex(currentQuestionIndex, exercise.questions);
        return () => {
            setQuestionUpsertionModalStatus({
                kind: 'creating',
                order,
                exercise: {
                    id: exercise.id,
                    defaultPoints: exercise.defaultPoints,
                    defaultQuestionKind: exercise.defaultQuestionKind,
                },
            });
        };
    }

    function buildOpenExerciseCreationModal(currentExerciseIndex: number) {
        const order = computeOrderForIndex(currentExerciseIndex, props.exercises);
        return () => {
            setExerciseUpsertionModalStatus({ kind: 'creating', order });
        };
    }

    function closeExerciseUpsertionModal() {
        setExerciseUpsertionModalStatus(undefined);
    }

    function closeQuestionUpsertionModal() {
        setQuestionUpsertionModalStatus(undefined);
    }

    function buildOnExerciseExpandedChange(exerciseId: number) {
        return (_: any, isExpanded: boolean) => {
            setCurrentExerciseExpanded(isExpanded ? exerciseId : undefined);
        };
    }
}

export { QuestionsEditing };
