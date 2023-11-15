import { Typography, styled } from '@mui/material';
import { TestPageLayout } from '../components/TestPageLayout';
import { exerciseWithAnswersType } from '../types';
import { computeAnswerStatus } from '../lib/computeAnswerStatus';
import { manualQuestionKinds } from '../../../constants';
import { computeResult } from '../lib/computeResult';
import { extractMarks } from '../lib/extractMarks';
import { QuestionChecking } from '../ExamChecking/QuestionChecking';
import { ExerciseTitle } from '../components/ExerciseTitle';

function QuestionsConsulting(props: {
    exercises: Array<exerciseWithAnswersType>;
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
                        <ExerciseTitle exercise={exercise} />
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

const QuestionIndicatorsContainer = styled('div')({});

export { QuestionsConsulting };
