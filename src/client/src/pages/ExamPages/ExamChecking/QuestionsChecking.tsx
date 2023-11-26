import { IconButton, Slider, Typography, styled } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GradingIcon from '@mui/icons-material/Grading';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QuestionChecking } from './QuestionChecking';
import { TestPageLayout } from '../components/TestPageLayout';
import { api } from '../../../lib/api';
import { useAlert } from '../../../lib/alert';
import { exerciseWithAnswersType } from '../types';
import { computeAnswerStatus } from '../lib/computeAnswerStatus';
import { UpdateAnswersButtons } from './UpdateAnswersButtons';
import { attemptStatusType, questionKindType } from '../../../types';
import { computeAttemptIdNeighbours } from './lib/computeAttemptIdNeighbours';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { extractMarks, manualMarksType } from '../lib/extractMarks';
import { manualQuestionKinds } from '../../../constants';
import { computeResult } from '../lib/computeResult';
import { ExerciseTitle } from '../components/ExerciseTitle';
import { pathHandler } from '../../../lib/pathHandler';
import { LoadingButton } from '@mui/lab';
import { attemptsCountByAttemptStatusApiType } from './types';
import { AttemptsCount } from './AttemptsCount';
import { Dialog } from '../../../components/Dialog';
import { Button } from '../../../components/Button';
import { useGlobalLoading } from '../../../lib/globalLoading';

function QuestionsChecking(props: {
    refetch: () => void;
    exercises: Array<exerciseWithAnswersType>;
    examName: string;
    examId: string;
    attemptStatus: attemptStatusType;
    attemptsCountByAttemptStatus: attemptsCountByAttemptStatusApiType;
    studentEmail: string;
    attemptId: string;
}) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [searchParams] = useSearchParams();

    const initialMarks = extractMarks(props.exercises);
    const [manualMarks, setManualMarks] = useState<manualMarksType>(initialMarks.manual);
    const { displayAlert } = useAlert();
    const result = computeResult(props.exercises);
    const { isGloballyLoading, setIsGloballyLoading } = useGlobalLoading();
    const attemptIds = searchParams.get('attemptIds') || '';

    const saveMarkMutation = useMutation({
        mutationFn: api.updateMark,
        onSuccess: () => {
            setIsGloballyLoading(false);
            props.refetch();
        },
        onError: (error) => {
            setIsGloballyLoading(false);
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre dernière note n'a pas pu être sauvegardée.",
            });
        },
    });

    const lockAttemptMutation = useMutation({
        mutationFn: api.updateEndedAt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examResults'] });
            displayAlert({
                variant: 'success',
                text: "L'examen a bien été terminé pour cet étudiant. Il ne pourra plus modifier sa copie, et vous pouvez maintenant la corriger",
            });
        },
        onError: (error: any) => {
            displayAlert({
                variant: 'error',
                text: "L'opération a échoué.",
            });
            console.error(error);
        },
    });

    const markAsCorrectedMutation = useMutation({
        mutationFn: api.updateCorrectedAt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attempts', props.attemptId] });
            queryClient.invalidateQueries({
                queryKey: ['attempts-count-by-attempt-status', props.examId],
            });
            displayAlert({
                variant: 'success',
                text: "Vous avez marqué cette copie comme corrigé. Vous ne pouvez plus en modifier les notes, et l'étudiant pourra la consulter.",
            });
        },
        onError: (error: any) => {
            displayAlert({
                variant: 'error',
                text: "L'opération a échoué.",
            });
            console.error(error);
        },
    });

    const markAsUncorrectedMutation = useMutation({
        mutationFn: api.deleteCorrectedAt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attempts', props.attemptId] });
            queryClient.invalidateQueries({
                queryKey: ['attempts-count-by-attempt-status', props.examId],
            });

            displayAlert({
                variant: 'success',
                text: 'Vous pouvez de nouveau modifier les notes de cette copie.',
            });
        },
        onError: (error: any) => {
            displayAlert({
                variant: 'error',
                text: "L'opération a échoué.",
            });
            console.error(error);
        },
    });

    const [attemptIdToNavigateTo, setAttemptIdToNavigateTo] = useState<string | undefined>(
        undefined,
    );
    const isConfirmAccessAnotherAttemptDialogOpen = !!attemptIdToNavigateTo;

    useEffect(() => {
        const marks = extractMarks(props.exercises);
        setManualMarks(marks.manual);
    }, [props.exercises]);

    const { next, previous } = computeAttemptIdNeighbours(props.attemptId, attemptIds);

    const editableQuestionKindsAnswers: questionKindType[] = ['phraseMelangee', 'questionTrou'];
    const areThereQuestionsNotCorrected = Object.values(manualMarks).some(
        (manualMark) => manualMark === undefined,
    );
    const canCorrectAttempt =
        props.attemptStatus === 'finished' || props.attemptStatus === 'expired';
    const UpdateCorrectedAtButton = renderUpdateCorrectedAtButton(props.attemptStatus);

    return (
        <TestPageLayout
            studentEmail={props.studentEmail}
            title={props.examName}
            buttons={UpdateCorrectedAtButton ? [UpdateCorrectedAtButton] : []}
            result={result}
            isLoading={isGloballyLoading}
        >
            <>
                <LeftArrowContainer>
                    <IconButton disabled={!previous} onClick={buildOnArrowClick(previous)}>
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                </LeftArrowContainer>
                <AttemptsCount
                    attemptsCountByCorrectedStatus={props.attemptsCountByAttemptStatus}
                />
                <Dialog
                    buttons={[
                        <Button
                            onClick={() => {
                                if (attemptIdToNavigateTo) {
                                    setAttemptIdToNavigateTo(undefined);
                                    navigateToNewAttempt(attemptIdToNavigateTo);
                                }
                            }}
                        >
                            Non
                        </Button>,
                        <Button
                            variant="contained"
                            onClick={() =>
                                attemptIdToNavigateTo &&
                                markAsCorrectedAndNavigate(attemptIdToNavigateTo)
                            }
                            autoFocus
                        >
                            Oui, marquer cette copie comme corrigée
                        </Button>,
                    ]}
                    isOpen={isConfirmAccessAnotherAttemptDialogOpen}
                    onClose={() => setAttemptIdToNavigateTo(undefined)}
                    title="La copie actuelle n'est pas marquée comme corrigée"
                    text="Souhaitez-vous la marquer comme corrigée avant d'accéder à la copie suivante ?"
                />
                {props.exercises.map((exercise) => (
                    <ExerciseContainer key={'exercise-' + exercise.id}>
                        <ExerciseTitle exercise={exercise} />
                        {exercise.questions.map((question, index: number) => {
                            const mark = manualQuestionKinds.includes(question.kind)
                                ? manualMarks[question.id]
                                : question.mark;
                            const answerStatus = computeAnswerStatus(mark, question.points);
                            return (
                                <QuestionCheckingContainer key={'question-' + question.id}>
                                    <QuestionIndicatorsContainer>
                                        <QuestionIndicatorContainer>
                                            {manualQuestionKinds.includes(question.kind) ? (
                                                <MarkSliderContainer>
                                                    <Slider
                                                        disabled={!canCorrectAttempt}
                                                        onClick={buildOnClickSlider(question.id)}
                                                        onChange={buildOnChangeSlider(question.id)}
                                                        onChangeCommitted={buildOnChangeCommittedSlider(
                                                            question.id,
                                                        )}
                                                        size="small"
                                                        step={0.5}
                                                        min={0}
                                                        max={question.points}
                                                        valueLabelDisplay="auto"
                                                        marks
                                                        value={manualMarks[question.id] || 0}
                                                    />
                                                    <Typography>
                                                        {manualMarks[question.id] !== undefined
                                                            ? manualMarks[question.id]
                                                            : '...'}{' '}
                                                        / {question.points}
                                                    </Typography>
                                                </MarkSliderContainer>
                                            ) : (
                                                <Typography>
                                                    {question.mark?.toFixed(1)} / {question.points}
                                                </Typography>
                                            )}
                                        </QuestionIndicatorContainer>

                                        {editableQuestionKindsAnswers.includes(question.kind) && (
                                            <UpdateAnswersButtons
                                                canCorrectAttempt={canCorrectAttempt}
                                                examId={props.examId}
                                                refetch={props.refetch}
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
                <RightArrowContainer>
                    <IconButton disabled={!next} onClick={buildOnArrowClick(next)}>
                        <ArrowForwardIcon fontSize="large" />
                    </IconButton>
                </RightArrowContainer>
            </>
        </TestPageLayout>
    );

    function renderUpdateCorrectedAtButton(attemptStatus: attemptStatusType) {
        switch (attemptStatus) {
            case 'finished':
                return (
                    <LoadingButton
                        loading={markAsCorrectedMutation.isPending}
                        variant="contained"
                        startIcon={<GradingIcon />}
                        onClick={markAsCorrected}
                    >
                        Marquer cette copie comme corrigée
                    </LoadingButton>
                );
            case 'expired':
                return (
                    <LoadingButton
                        loading={markAsCorrectedMutation.isPending}
                        variant="contained"
                        startIcon={<GradingIcon />}
                        onClick={markAsCorrected}
                    >
                        Marquer cette copie comme corrigée
                    </LoadingButton>
                );
            case 'corrected':
                return (
                    <LoadingButton
                        loading={markAsUncorrectedMutation.isPending}
                        startIcon={<GradingIcon />}
                        onClick={() =>
                            markAsUncorrectedMutation.mutate({
                                attemptId: props.attemptId,
                                examId: props.examId,
                            })
                        }
                    >
                        Reprendre la correction de cette copie
                    </LoadingButton>
                );
            case 'pending':
                return (
                    <LoadingButton
                        loading={lockAttemptMutation.isPending}
                        startIcon={<LockIcon />}
                        onClick={() =>
                            lockAttemptMutation.mutate({
                                attemptId: props.attemptId,
                            })
                        }
                    >
                        Terminer l'examen pour cet étudiant
                    </LoadingButton>
                );
            default:
                return undefined;
        }
    }

    function markAsCorrected() {
        if (areThereQuestionsNotCorrected) {
            displayAlert({
                variant: 'error',
                text: "Vous ne pouvez pas marquer cette copie comme corrigée. Certaines questions n'ont pas encore été notées.",
            });
        } else {
            markAsCorrectedMutation.mutate({
                attemptId: props.attemptId,
                examId: props.examId,
            });
        }
    }

    function markAsCorrectedAndNavigate(attemptIdToNavigateTo: string) {
        setAttemptIdToNavigateTo(undefined);
        markAsCorrectedMutation.mutate({
            attemptId: props.attemptId,
            examId: props.examId,
        });
        navigateToNewAttempt(attemptIdToNavigateTo);
    }

    function buildOnChangeSlider(questionId: number) {
        return (event: Event, value: number | number[]) => {
            if (typeof value !== 'object') {
                setManualMarks({ ...manualMarks, [questionId]: value });
            }
        };
    }

    function buildOnClickSlider(questionId: number) {
        return () => {
            setManualMarks({ ...manualMarks, [questionId]: manualMarks[questionId] || 0 });
        };
    }

    function buildOnChangeCommittedSlider(questionId: number) {
        return (event: Event | SyntheticEvent<Element, Event>, value: number | number[]) => {
            if (typeof value !== 'object') {
                setIsGloballyLoading(true);
                saveMarkMutation.mutate({ attemptId: props.attemptId, questionId, mark: value });
            }
        };
    }

    function buildOnArrowClick(attemptIdToNavigateTo: string | undefined) {
        return () => {
            if (!attemptIdToNavigateTo) {
                return;
            }
            if (props.attemptStatus !== 'corrected' && !areThereQuestionsNotCorrected) {
                setAttemptIdToNavigateTo(attemptIdToNavigateTo);
            } else {
                navigateToNewAttempt(attemptIdToNavigateTo);
            }
        };
    }

    function navigateToNewAttempt(newAttemptId: string) {
        const path = pathHandler.getRoutePath(
            'EXAM_CHECKING',
            { examId: props.examId, attemptId: newAttemptId },
            { attemptIds },
        );
        navigate(path);
    }
}
const ARROW_CONTAINER_SIZE = 100;

const LeftArrowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    left: theme.spacing(4),
    top: `calc(100vh / 2 - ${ARROW_CONTAINER_SIZE / 2}px)`,
    width: ARROW_CONTAINER_SIZE,
    height: ARROW_CONTAINER_SIZE,
}));

const RightArrowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    right: theme.spacing(4),
    top: `calc(100vh / 2 - ${ARROW_CONTAINER_SIZE / 2}px)`,
    width: ARROW_CONTAINER_SIZE,
    height: ARROW_CONTAINER_SIZE,
}));

const QuestionCheckingContainer = styled('div')(({ theme }) => ({
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

const MarkSliderContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginRight: theme.spacing(1),
}));

const QuestionIndicatorsContainer = styled('div')({});

export { QuestionsChecking };
