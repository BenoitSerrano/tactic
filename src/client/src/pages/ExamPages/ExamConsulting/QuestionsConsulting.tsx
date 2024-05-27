import { useState } from 'react';
import { Typography, styled } from '@mui/material';
import { TestPageLayout } from '../components/TestPageLayout';
import { examWithAnswersType } from '../types';
import { computeAnswerStatus } from '../lib/computeAnswerStatus';
import { computeResults } from '../lib/computeResults';
import { QuestionChecking } from '../ExamChecking/QuestionChecking';
import { ExerciseContainer } from '../components/ExerciseContainer';
import { QuestionContainer } from '../components/QuestionContainer';
import { computeDisplayedMark } from '../ExamChecking/lib/computeDisplayedMark';
import { HorizontalDivider } from '../../../components/HorizontalDivider';

function QuestionsConsulting(props: {
    exam: examWithAnswersType;
    studentEmail: string;
    attemptId: string;
}) {
    const [currentExerciseExpanded, setCurrentExerciseExpanded] = useState<number | undefined>();
    const results = computeResults(props.exam.exercises);

    return (
        <TestPageLayout
            studentEmail={props.studentEmail}
            title={props.exam.name}
            highlightedResult={results.converted}
            lowlightedResult={results.total}
        >
            <>
                {props.exam.exercises.map((exercise, exerciseIndex) => {
                    const isLastExercise = exerciseIndex === props.exam.exercises.length - 1;

                    return (
                        <>
                            <ExerciseContainer
                                isExpanded={currentExerciseExpanded === exercise.id}
                                onChangeExpanded={buildOnExerciseExpandedChange(exercise.id)}
                                key={`exercise-${exercise.id}`}
                                exercise={exercise}
                            >
                                {exercise.questions.map((question, index: number) => {
                                    const answerStatus = computeAnswerStatus(question);

                                    const displayedMark = computeDisplayedMark(question);
                                    const isLastQuestion = index === exercise.questions.length - 1;

                                    return (
                                        <>
                                            <QuestionContainer key={question.id}>
                                                <QuestionIndicatorsContainer>
                                                    <QuestionIndicatorContainer>
                                                        <Typography>
                                                            {displayedMark.mark} /{' '}
                                                            {displayedMark.points}
                                                        </Typography>
                                                    </QuestionIndicatorContainer>
                                                </QuestionIndicatorsContainer>
                                                <QuestionChecking
                                                    shouldDisplayRightAnswers={
                                                        props.exam.shouldDisplayRightAnswers
                                                    }
                                                    attemptId={props.attemptId}
                                                    examId={props.exam.id}
                                                    canUpdateAnswers={false}
                                                    key={'question' + question.id}
                                                    index={index + 1}
                                                    question={question}
                                                    answerStatus={answerStatus}
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
            </>
        </TestPageLayout>
    );

    function buildOnExerciseExpandedChange(exerciseId: number) {
        return (_: any, isExpanded: boolean) => {
            setCurrentExerciseExpanded(isExpanded ? exerciseId : undefined);
        };
    }
}

const QuestionIndicatorContainer = styled('div')({
    minWidth: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
});

const QuestionIndicatorsContainer = styled('div')({});

export { QuestionsConsulting };
