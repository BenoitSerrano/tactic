import { IconButton, TextField, Tooltip, Typography, styled } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import { FLOATING_NUMBER_REGEX } from '../../constants';
import { QuestionChecking } from './QuestionChecking';
import { TestPageLayout } from '../../components/TestPageLayout';
import { LoadingButton } from '@mui/lab';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { questionType } from './types';
import { computeAnswerStatus } from './lib/computeAnswerStatus';

type marksType = Record<number, string>;

function QuestionsChecking(props: {
    questions: Array<questionType>;
    examName: string;
    examId: string;
    studentEmail: string;
    attemptId: string;
}) {
    const queryClient = new QueryClient();

    const initialMarks = props.questions.reduce(
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

    const addRightAnswerMutation = useMutation({
        mutationFn: api.addQuestionRightAnswer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attempts', props.attemptId] });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre modification n'a pas pu être prise en compte",
            });
        },
    });

    const removeOkAnswerMutation = useMutation({
        mutationFn: api.removeOkAnswer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attempts', props.attemptId] });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre modification n'a pas pu être prise en compte",
            });
        },
    });

    const addAcceptableAnswerMutation = useMutation({
        mutationFn: api.addQuestionAcceptableAnswer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attempts', props.attemptId] });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre modification n'a pas pu être prise en compte",
            });
        },
    });

    return (
        <TestPageLayout
            studentEmail={props.studentEmail}
            title={props.examName}
            buttons={[
                <LoadingButton
                    loading={saveMarksMutation.isLoading}
                    variant="contained"
                    onClick={saveMarks}
                >
                    Sauvegarder
                </LoadingButton>,
            ]}
        >
            {props.questions.map((question, index: number) => {
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

                            {question.kind === 'questionTrou' && (
                                <UpdateAnswersButtonContainer>
                                    <Tooltip title="Marquer la réponse comme correcte">
                                        <IconButton
                                            size="small"
                                            color="success"
                                            disabled={answerStatus === 'right'}
                                            onClick={buildOnAddToRightAnswers(
                                                question.id,
                                                question.answer,
                                            )}
                                        >
                                            <CheckIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Marquer la réponse comme acceptable">
                                        <IconButton
                                            size="small"
                                            color="warning"
                                            disabled={answerStatus === 'acceptable'}
                                            onClick={buildOnAddToAcceptableAnswers(
                                                question.id,
                                                question.answer,
                                            )}
                                        >
                                            <SentimentNeutralIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Marquer la réponse comme incorrecte">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            disabled={answerStatus === 'wrong'}
                                            onClick={buildOnRemoveOkAnswer(
                                                question.id,
                                                question.answer,
                                            )}
                                        >
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </UpdateAnswersButtonContainer>
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
        </TestPageLayout>
    );

    function saveMarks() {
        const formattedMarks = Object.entries(marks).reduce(
            (acc, [questionId, mark]) => ({ ...acc, [questionId]: Number(mark) }),
            {} as Record<number, number>,
        );
        saveMarksMutation.mutate({ attemptId: props.attemptId, marks: formattedMarks });
    }

    function buildOnAddToRightAnswers(questionId: number, currentAnswer: string | undefined) {
        return () => {
            if (currentAnswer === undefined) {
                return;
            }
            addRightAnswerMutation.mutate({
                examId: props.examId,
                questionId,
                rightAnswer: currentAnswer,
            });
        };
    }

    function buildOnRemoveOkAnswer(questionId: number, currentAnswer: string | undefined) {
        return () => {
            if (currentAnswer === undefined) {
                return;
            }
            removeOkAnswerMutation.mutate({
                examId: props.examId,
                questionId,
                okAnswer: currentAnswer,
            });
        };
    }

    function buildOnAddToAcceptableAnswers(questionId: number, currentAnswer: string | undefined) {
        return () => {
            if (currentAnswer === undefined) {
                return;
            }
            addAcceptableAnswerMutation.mutate({
                examId: props.examId,
                questionId,
                acceptableAnswer: currentAnswer,
            });
        };
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

const UpdateAnswersButtonContainer = styled('div')(({ theme }) => ({}));
const QuestionIndicatorContainer = styled('div')({
    minWidth: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
});

const QuestionIndicatorsContainer = styled('div')({});

const MarkTextField = styled(TextField)({
    width: 30,
});

export { QuestionsChecking };
