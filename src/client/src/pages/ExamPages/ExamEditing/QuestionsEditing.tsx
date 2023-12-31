import { Typography, styled } from '@mui/material';
import { TestPageLayout } from '../components/TestPageLayout';
import { useState } from 'react';
import { ExerciseContainer } from '../components/ExerciseContainer';
import { computeTotalPoints } from '../lib/computeTotalPoints';
import { QuestionContainer } from '../components/QuestionContainer';
import { exerciseUpsertionModalStatusType, exerciseWithQuestionsType } from './types';
import { HorizontalDividerToAddExercise } from './HorizontalDividers';
import { ExerciseUpsertionModal } from './ExerciseUpsertionModal';

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
    const totalPoints = computeTotalPoints(props.exercises);

    return (
        <>
            <TestPageLayout studentEmail="-" title={props.title} result={totalPoints}>
                <HorizontalDividerToAddExercise onClick={buildOpenExerciseCreationModal()} />

                {props.exercises.map((exercise) => {
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
                                {exercise.questions.map((question, index) => (
                                    <QuestionContainer
                                        isLastItem={index === exercise.questions.length - 1}
                                        key={`question-${question.id}`}
                                    >
                                        <QuestionIndicatorsContainer>
                                            <Typography>/ {question.points}</Typography>
                                        </QuestionIndicatorsContainer>
                                    </QuestionContainer>
                                ))}
                            </ExerciseContainer>
                            <HorizontalDividerToAddExercise
                                onClick={buildOpenExerciseCreationModal()}
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
        </>
    );

    function buildOpenExerciseCreationModal() {
        return () => {
            setExerciseUpsertionModalStatus({ kind: 'creating' });
        };
    }

    function closeExerciseUpsertionModal() {
        setExerciseUpsertionModalStatus(undefined);
    }
    function buildOnExerciseExpandedChange(exerciseId: number) {
        return (_: any, isExpanded: boolean) => {
            setCurrentExerciseExpanded(isExpanded ? exerciseId : undefined);
        };
    }
}

const QuestionIndicatorsContainer = styled('div')({
    minWidth: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export { QuestionsEditing };
