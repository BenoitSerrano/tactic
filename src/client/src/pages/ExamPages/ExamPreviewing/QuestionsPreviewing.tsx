import { Typography, styled } from '@mui/material';
import { TestPageLayout } from '../components/TestPageLayout';
import { useState } from 'react';
import { QuestionAnswering } from '../components/QuestionAnswering';
import { exerciseWithoutAnswersType } from '../types';
import { ExerciseContainer } from '../components/ExerciseContainer';
import { computeExerciseProgress } from '../lib/computeExerciseProgress';

function QuestionsPreviewing(props: {
    title: string;
    examId: string;
    exercises: Array<exerciseWithoutAnswersType>;
}) {
    const [currentAnswers, setCurrentAnswers] = useState<Record<number, string>>({});

    return (
        <>
            <TestPageLayout studentEmail="-" title={props.title} buttons={[]}>
                {props.exercises.map((exercise, exerciseIndex) => {
                    const progress = computeExerciseProgress(exercise.questions, currentAnswers);
                    const exerciseIndication = {
                        progress,
                        hideMark: true,
                    };

                    return (
                        <ExerciseContainer
                            key={`exercise-${exercise.id}`}
                            exercise={exercise}
                            indication={exerciseIndication}
                            isLastItem={exerciseIndex === props.exercises.length - 1}
                        >
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
                    );
                })}
            </TestPageLayout>
        </>
    );
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

export { QuestionsPreviewing };
