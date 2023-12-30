import { Typography, styled } from '@mui/material';
import { TestPageLayout } from '../components/TestPageLayout';
import { useState } from 'react';
import { QuestionAnswering } from '../components/QuestionAnswering';
import { ExerciseContainer } from '../components/ExerciseContainer';
import { computeExerciseProgress } from '../lib/computeExerciseProgress';
import { computeTotalPoints } from '../lib/computeTotalPoints';
import { QuestionContainer } from '../components/QuestionContainer';
import { exerciseWithQuestionsType } from './types';
import { HorizontalDividerToAddExercise } from './HorizontalDividers';

function QuestionsEditing(props: {
    title: string;
    examId: string;
    exercises: Array<exerciseWithQuestionsType>;
}) {
    const [currentExerciseExpanded, setCurrentExerciseExpanded] = useState<number | undefined>(
        undefined,
    );
    const totalPoints = computeTotalPoints(props.exercises);

    return (
        <>
            <TestPageLayout studentEmail="-" title={props.title} result={totalPoints}>
                {props.exercises.map((exercise, exerciseIndex) => {
                    const exerciseIndication = { hideMark: true };
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
                            {!isLastExercise && (
                                <HorizontalDividerToAddExercise onClick={() => {}} />
                            )}
                        </>
                    );
                })}
            </TestPageLayout>
        </>
    );
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
