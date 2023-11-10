import { Typography, styled } from '@mui/material';
import { TestPageLayout } from '../components/TestPageLayout';
import { exerciseType } from '../types';
import { computeAnswerStatus } from '../lib/computeAnswerStatus';
import { manualQuestionKinds } from '../../../constants';
import { computeResult } from '../lib/computeResult';
import { extractMarks } from '../lib/extractMarks';
import { QuestionChecking } from '../components/QuestionChecking';

function QuestionsConsulting(props: {
    exercises: Array<exerciseType>;
    examName: string;
    examId: string;
    studentEmail: string;
    attemptId: string;
}) {
    const result = computeResult(props.exercises);
    const marks = extractMarks(props.exercises);

    return (
        <TestPageLayout
            studentEmail={props.studentEmail}
            title={props.examName}
            buttons={[]}
            result={result}
        >
            <>
                {props.exercises.map((exercise) => (
                    <ExerciseContainer key={exercise.id}>
                        <ExerciseTitleContainer>
                            <Typography variant="h3">{exercise.name}</Typography>
                            <Typography variant="h4">{exercise.instruction}</Typography>
                        </ExerciseTitleContainer>
                        {exercise.questions.map((question, index: number) => {
                            const mark = manualQuestionKinds.includes(question.kind)
                                ? marks.manual[question.id]
                                : question.mark;
                            const answerStatus = computeAnswerStatus(mark, question.points);
                            return (
                                <QuestionConsultingContainer key={question.id}>
                                    <QuestionIndicatorsContainer>
                                        <QuestionIndicatorContainer>
                                            <Typography>
                                                {question.mark} / {question.points}
                                            </Typography>
                                        </QuestionIndicatorContainer>
                                    </QuestionIndicatorsContainer>
                                    <QuestionChecking
                                        key={'question' + question.id}
                                        index={index + 1}
                                        question={question}
                                        answerStatus={answerStatus}
                                    />
                                </QuestionConsultingContainer>
                            );
                        })}
                    </ExerciseContainer>
                ))}
            </>
        </TestPageLayout>
    );
}

const QuestionConsultingContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    display: 'flex',
}));

const QuestionIndicatorContainer = styled('div')({
    minWidth: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
});

const ExerciseContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.common.black}`,
}));

const ExerciseTitleContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

const QuestionIndicatorsContainer = styled('div')({});

export { QuestionsConsulting };
