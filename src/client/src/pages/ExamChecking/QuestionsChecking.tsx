import { TextField, Typography, styled } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FLOATING_NUMBER_REGEX } from '../../constants';
import { QuestionChecking } from './QuestionChecking';
import { TestPageLayout } from '../../components/TestPageLayout';
import { LoadingButton } from '@mui/lab';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { exerciseType, questionType } from './types';
import { computeAnswerStatus } from './lib/computeAnswerStatus';
import { UpdateAnswersButtons } from './UpdateAnswersButtons';
import { questionKindType } from '../../types';

type marksType = Record<number, string>;

function QuestionsChecking(props: {
    onEditAnswers: () => void;
    exercises: Array<exerciseType>;
    examName: string;
    examId: string;
    studentEmail: string;
    attemptId: string;
}) {
    const questions: Array<questionType> = [];
    for (const exercise of props.exercises) {
        questions.push(...exercise.questions);
    }

    const initialMarks = questions.reduce(
        (acc, question) => ({
            ...acc,
            [question.id]: question.mark === undefined ? '' : `${question.mark}`,
        }),
        {} as marksType,
    );
    const [marks, setMarks] = useState<marksType>(initialMarks);
    const { displayAlert } = useAlert();

    const saveMarksMutation = useMutation({
        mutationFn: api.updateMarks,
        onSuccess: () => {
            displayAlert({ variant: 'success', text: 'Vos notes ont bien été sauvegardées' });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Vos notes n'ont pas pu être sauvegardées.",
            });
        },
    });

    const editableQuestionKindsAnswers: questionKindType[] = ['phraseMelangee', 'questionTrou'];

    return (
        <TestPageLayout
            studentEmail={props.studentEmail}
            title={props.examName}
            buttons={[
                <LoadingButton
                    key="save-marks-button"
                    loading={saveMarksMutation.isPending}
                    variant="contained"
                    onClick={saveMarks}
                >
                    Sauvegarder
                </LoadingButton>,
            ]}
        >
            {props.exercises.map((exercise) => (
                <ExerciseContainer key={exercise.id}>
                    <ExerciseTitleContainer>
                        <Typography variant="h3">{exercise.name}</Typography>
                        <Typography variant="h4">{exercise.instruction}</Typography>
                    </ExerciseTitleContainer>
                    {exercise.questions.map((question, index: number) => {
                        const answerStatus = computeAnswerStatus(question.mark, question.points);
                        return (
                            <QuestionCheckingContainer key={question.id}>
                                <QuestionIndicatorsContainer>
                                    <QuestionIndicatorContainer>
                                        {question.rightAnswers.length === 0 ? (
                                            <MarkTextField
                                                onChange={buildOnMarkChange(question.id)}
                                                value={marks[question.id] || ''}
                                                variant="standard"
                                            />
                                        ) : (
                                            <Typography>{question.mark || 0}</Typography>
                                        )}
                                        <Typography> / {question.points}</Typography>
                                    </QuestionIndicatorContainer>

                                    {editableQuestionKindsAnswers.includes(question.kind) && (
                                        <UpdateAnswersButtons
                                            examId={props.examId}
                                            onEditAnswers={props.onEditAnswers}
                                            question={question}
                                        />
                                    )}
                                </QuestionIndicatorsContainer>
                                <QuestionChecking
                                    key={'question' + question.id}
                                    index={index + 1}
                                    question={question}
                                    answerStatus={answerStatus}
                                />
                            </QuestionCheckingContainer>
                        );
                    })}
                </ExerciseContainer>
            ))}
        </TestPageLayout>
    );

    function saveMarks() {
        const formattedMarks = Object.entries(marks).reduce(
            (acc, [questionId, mark]) => ({ ...acc, [questionId]: Number(mark) }),
            {} as Record<number, number>,
        );
        saveMarksMutation.mutate({ attemptId: props.attemptId, marks: formattedMarks });
    }

    function buildOnMarkChange(questionId: number) {
        return (event: ChangeEvent<HTMLInputElement>) => {
            const mark = event.target.value;
            if (mark.match(FLOATING_NUMBER_REGEX)) {
                setMarks({ ...marks, [questionId]: mark });
            }
        };
    }
}

const QuestionCheckingContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
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

const MarkTextField = styled(TextField)({
    width: 30,
});

export { QuestionsChecking };
