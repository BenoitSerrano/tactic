import { Typography, styled } from '@mui/material';
import { TestPageLayout } from '../components/TestPageLayout';
import { ExerciseTitle } from '../components/ExerciseTitle';
import { useState } from 'react';
import { QuestionAnswering } from '../components/QuestionAnswering';
import { exerciseWithoutAnswersType } from '../types';

function QuestionsPreviewing(props: {
    title: string;
    examId: string;
    exercises: Array<exerciseWithoutAnswersType>;
}) {
    const [currentAnswers, setCurrentAnswers] = useState<Record<number, string>>({});
    return (
        <>
            <TestPageLayout studentEmail="-" title={props.title} buttons={[]}>
                {props.exercises.map((exercise) => (
                    <ExerciseContainer key={`exercise-${exercise.id}`}>
                        <ExerciseTitle exercise={exercise} />
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

const ExerciseContainer = styled('div')(({ theme }) => ({
    userSelect: 'none',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.common.black}`,
}));

export { QuestionsPreviewing };
