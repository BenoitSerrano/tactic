import { Typography, styled } from '@mui/material';
import { TestPageLayout } from '../components/TestPageLayout';
import { useState } from 'react';
import { QuestionAnswering } from '../components/QuestionAnswering';
import { exerciseWithoutAnswersType } from '../types';
import { ExerciseContainer } from '../components/ExerciseContainer';
import { computeTotalPoints } from '../lib/computeTotalPoints';
import { QuestionContainer } from '../components/QuestionContainer';
import { HorizontalDivider } from '../../../components/HorizontalDivider';
import { useExerciseIndex } from '../lib/useExerciseIndex';
import { EmptyExam } from '../components/EmptyExam';
import { ExercisesSummary } from '../components/ExercisesSummary';
import { computeExerciseProgress } from '../lib/computeExerciseProgress';

function QuestionsPreviewing(props: {
    title: string;
    examId: string;
    exercises: Array<exerciseWithoutAnswersType>;
}) {
    const [currentAnswers, setCurrentAnswers] = useState<Record<number, string>>({});
    const totalResult = computeTotalPoints(props.exercises);
    const exerciseIndexes = useExerciseIndex(props.exercises);
    const current = exerciseIndexes.current;
    const exercise = current !== undefined ? props.exercises[current] : undefined;
    if (current === undefined || !exercise) {
        return <EmptyExam title={props.title} />;
    }
    const progresses = props.exercises.map((exercise) =>
        computeExerciseProgress(exercise.questions, currentAnswers),
    );
    const progress = progresses[current];
    const exerciseIndication = {
        progress,
        hideMark: true,
    };

    return (
        <>
            <ExercisesSummary currentExerciseIndex={current} progresses={progresses} />
            <TestPageLayout studentEmail="-" title={props.title} highlightedResult={totalResult}>
                <>
                    <ExerciseContainer
                        exerciseIndexes={exerciseIndexes}
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
                </>
            </TestPageLayout>
        </>
    );
}

const QuestionIndicatorsContainer = styled('div')({
    minWidth: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export { QuestionsPreviewing };
