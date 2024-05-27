import { useState } from 'react';
import { IconButton, styled } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GradingIcon from '@mui/icons-material/Grading';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import { LoadingButton } from '@mui/lab';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QuestionChecking } from './QuestionChecking';
import { TestPageLayout } from '../components/TestPageLayout';
import { api } from '../../../lib/api';
import { useAlert } from '../../../lib/alert';
import { exerciseWithAnswersType } from '../types';
import { computeAnswerStatus } from '../lib/computeAnswerStatus';
import { UpdateAnswersButtons } from './UpdateAnswersButtons';
import { attemptStatusType, attemptsCountByAttemptStatusApiType } from '../../../types';
import { computeAttemptIdNeighbours } from './lib/computeAttemptIdNeighbours';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { manualQuestionKinds } from '../../../constants';
import { computeResults } from '../lib/computeResults';
import { pathHandler } from '../../../lib/pathHandler';
import { AttemptsCount } from './AttemptsCount';
import { Dialog } from '../../../components/Dialog';
import { Button } from '../../../components/Button';
import { ExerciseContainer } from '../components/ExerciseContainer';
import { QuestionContainer } from '../components/QuestionContainer';
import { HorizontalDivider } from '../../../components/HorizontalDivider';
import { computeExercisesCorrectionStatus } from './lib/computeExercisesCorrectionStatus';
import { DisplayedMark } from './DisplayedMark';

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

    const { displayAlert } = useAlert();
    const results = computeResults(props.exercises);
    const attemptIds = searchParams.get('attemptIds') || '';

    const lockAttemptMutation = useMutation({
        mutationFn: api.updateEndedAt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exam-results'] });
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
    const [currentExerciseExpanded, setCurrentExerciseExpanded] = useState<number | undefined>();

    const [attemptIdToNavigateTo, setAttemptIdToNavigateTo] = useState<string | undefined>(
        undefined,
    );
    const isConfirmAccessAnotherAttemptDialogOpen = !!attemptIdToNavigateTo;

    const { next, previous } = computeAttemptIdNeighbours(props.attemptId, attemptIds);

    const { statuses: questionsCorrectionStatuses, isCorrectionDone } =
        computeExercisesCorrectionStatus(props.exercises);
    const UpdateCorrectedAtButton = renderUpdateCorrectedAtButton(props.attemptStatus);
    return (
        <TestPageLayout
            studentEmail={props.studentEmail}
            title={props.examName}
            centerElement={UpdateCorrectedAtButton || undefined}
            highlightedResult={results.converted}
            lowlightedResult={results.total}
            // results={results}
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
                        <Button onClick={() => setAttemptIdToNavigateTo(undefined)}>
                            Non, rester
                        </Button>,
                        <Button
                            onClick={() => {
                                if (attemptIdToNavigateTo) {
                                    setAttemptIdToNavigateTo(undefined);
                                    navigateToNewAttempt(attemptIdToNavigateTo);
                                }
                            }}
                        >
                            Non, copie suivante
                        </Button>,
                        <Button
                            variant="contained"
                            onClick={() =>
                                attemptIdToNavigateTo &&
                                markAsCorrectedAndNavigate(attemptIdToNavigateTo)
                            }
                            autoFocus
                        >
                            Oui, marquer comme corrigée
                        </Button>,
                    ]}
                    isOpen={isConfirmAccessAnotherAttemptDialogOpen}
                    onClose={() => setAttemptIdToNavigateTo(undefined)}
                    title="La copie actuelle n'est pas marquée comme corrigée"
                    text="Souhaitez-vous la marquer comme corrigée avant d'aller à la copie suivante ?"
                />
                {props.exercises.map((exercise, exerciseIndex) => {
                    const isLastExercise = exerciseIndex === props.exercises.length - 1;
                    const shouldDisplayCorrectionWarning =
                        questionsCorrectionStatuses[exercise.id] === 'notCorrected';

                    const warningToDisplay = shouldDisplayCorrectionWarning
                        ? 'Il reste des questions non notées dans cet exercice'
                        : undefined;
                    return (
                        <>
                            <ExerciseContainer
                                isExpanded={currentExerciseExpanded === exercise.id}
                                onChangeExpanded={buildOnExerciseExpandedChange(exercise.id)}
                                key={'exercise-' + exercise.id}
                                exercise={exercise}
                                warningToDisplay={warningToDisplay}
                            >
                                {exercise.questions.map((question, questionIndex: number) => {
                                    const isQuestionManuallyCorrected =
                                        manualQuestionKinds.includes(question.kind);

                                    const answerStatus = computeAnswerStatus(question);

                                    const isLastQuestion =
                                        questionIndex === exercise.questions.length - 1;
                                    return (
                                        <>
                                            <QuestionContainer key={'question-' + question.id}>
                                                <QuestionIndicatorsContainer>
                                                    {(question.kind === 'phraseMelangee' ||
                                                        question.kind === 'questionReponse' ||
                                                        question.kind === 'texteLibre') && (
                                                        <UpdateAnswersButtons
                                                            attemptStatus={props.attemptStatus}
                                                            examId={props.examId}
                                                            attemptId={props.attemptId}
                                                            refetch={props.refetch}
                                                            question={question}
                                                            isQuestionManuallyCorrected={
                                                                isQuestionManuallyCorrected
                                                            }
                                                        />
                                                    )}
                                                    <DisplayedMark
                                                        attemptId={props.attemptId}
                                                        examId={props.examId}
                                                        question={question}
                                                        isQuestionManuallyCorrected={
                                                            isQuestionManuallyCorrected
                                                        }
                                                    />
                                                </QuestionIndicatorsContainer>
                                                <QuestionChecking
                                                    attemptStatus={props.attemptStatus}
                                                    attemptId={props.attemptId}
                                                    examId={props.examId}
                                                    canUpdateAnswers
                                                    key={'question' + question.id}
                                                    index={questionIndex + 1}
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
        if (!isCorrectionDone) {
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

    function buildOnExerciseExpandedChange(exerciseId: number) {
        return (_: any, isExpanded: boolean) => {
            setCurrentExerciseExpanded(isExpanded ? exerciseId : undefined);
        };
    }

    function markAsCorrectedAndNavigate(attemptIdToNavigateTo: string) {
        setAttemptIdToNavigateTo(undefined);
        markAsCorrectedMutation.mutate({
            attemptId: props.attemptId,
            examId: props.examId,
        });
        navigateToNewAttempt(attemptIdToNavigateTo);
    }

    function buildOnArrowClick(attemptIdToNavigateTo: string | undefined) {
        return () => {
            if (!attemptIdToNavigateTo) {
                return;
            }
            if (props.attemptStatus !== 'corrected' && isCorrectionDone) {
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

const QuestionIndicatorsContainer = styled('div')({
    width: '150px',
    minWidth: '150px',
    paddingRight: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

export { QuestionsChecking };
