import { Typography, styled } from '@mui/material';
import { TestPageLayout } from '../components/TestPageLayout';
import { useState } from 'react';
import { QuestionAnswering } from '../components/QuestionAnswering';
import { exerciseWithoutAnswersType } from '../types';
import { ExerciseContainer } from '../components/ExerciseContainer';
import { computeExerciseProgress } from '../lib/computeExerciseProgress';
import { computeTotalPoints } from '../lib/computeTotalPoints';
import { QuestionContainer } from '../components/QuestionContainer';
import { HorizontalDivider } from '../../../components/HorizontalDivider';

function QuestionsPreviewing(props: {
    title: string;
    examId: string;
    exercises: Array<exerciseWithoutAnswersType>;
}) {
    const [currentAnswers, setCurrentAnswers] = useState<Record<number, string>>({});
    const [currentExerciseExpanded, setCurrentExerciseExpanded] = useState<number | undefined>();
    const totalPoints = computeTotalPoints(props.exercises);

    return (
        <>
            <TestPageLayout studentEmail="-" title={props.title} result={totalPoints}>
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
                                                    <Typography>/ {question.points}</Typography>
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

export { QuestionsPreviewing };
