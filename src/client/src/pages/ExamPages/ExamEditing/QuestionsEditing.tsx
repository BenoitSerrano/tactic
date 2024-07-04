import { TestPageLayout } from '../components/TestPageLayout';
import { useEffect, useState } from 'react';
import {
    EXERCISE_ACCORDION_SUMMARY_HEIGHT,
    ExerciseContainer,
} from '../components/ExerciseContainer';
import { computeTotalPoints } from '../lib/computeTotalPoints';
import {
    exerciseUpsertionModalStatusType,
    exerciseWithQuestionsType,
    questionUpsertionModalStatusType,
} from './types';
import {
    HorizontalDividerToAddExercise,
    HorizontalDividerToAddQuestion,
} from './HorizontalDividers';
import { ExerciseUpsertionModal } from './ExerciseUpsertionModal';
import { QuestionUpsertionModal } from './QuestionUpsertionModal/QuestionUpsertionModal';
import { QuestionViewMode } from './QuestionViewMode/QuestionViewMode';
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
    OnDragEndResponder,
} from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { tableHandler } from '../../../lib/tableHandler';
import { IconButton as MuiIconButton, Tooltip, styled } from '@mui/material';
import { HorizontalDivider, LightHorizontalDivider } from '../../../components/HorizontalDivider';
import { api } from '../../../lib/api';
import { useAlert } from '../../../lib/alert';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { computeOrderedItems } from './lib/computeOrderedItems';
import { IconButton } from '../../../components/IconButton';

function QuestionsEditing(props: {
    title: string;
    examId: string;
    exercises: Array<exerciseWithQuestionsType>;
}) {
    const { displayAlert } = useAlert();

    const [currentExerciseExpanded, setCurrentExerciseExpanded] = useState<number | undefined>();
    const [exerciseUpsertionModalStatus, setExerciseUpsertionModalStatus] = useState<
        exerciseUpsertionModalStatusType | undefined
    >(undefined);
    const [questionUpsertionModalStatus, setQuestionUpsertionModalStatus] = useState<
        questionUpsertionModalStatusType | undefined
    >(undefined);
    const queryClient = useQueryClient();
    const updateQuestionsOrderMutation = useMutation({
        mutationFn: api.updateQuestionsOrder,
        onError: () => {
            displayAlert({
                variant: 'error',
                text: "La question n'a pas pu être déplacée. Veuillez recharger la page.",
            });
        },
    });
    const updateExercisesOrderMutation = useMutation({
        mutationFn: api.updateExercisesOrder,
        onError: () => {
            displayAlert({
                variant: 'error',
                text: "La question n'a pas pu être déplacée. Veuillez recharger la page.",
            });
        },
    });
    const deleteExerciseMutation = useMutation({
        mutationFn: api.deleteExercise,
        onSuccess: (deletedExercise: { id: number }) => {
            setOrderedExerciseIds(
                orderedExerciseIds.filter((exerciseId) => exerciseId !== deletedExercise.id),
            );
            displayAlert({ variant: 'success', text: "L'exercice a été supprimé." });
            queryClient.invalidateQueries({ queryKey: ['exam-with-questions', props.examId] });
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: "L'exercise n'a pas pu être supprimé. Veuillez recharger la page.",
            });
        },
    });

    const initialOrderedExerciseIds = props.exercises.map((exercise) => exercise.id);
    const [orderedExerciseIds, setOrderedExerciseIds] = useState(initialOrderedExerciseIds);
    const initialOrderedQuestionIds = computeOrderedQuestionIds(props.exercises);
    const [orderedQuestionIds, setOrderedQuestionIds] = useState(initialOrderedQuestionIds);
    useEffect(() => {
        const newOrderedQuestionIds = computeOrderedQuestionIds(props.exercises);
        setOrderedQuestionIds(newOrderedQuestionIds);
    }, [props.exercises]);

    const orderedExercises = computeOrderedItems(orderedExerciseIds, props.exercises);

    const totalResult = computeTotalPoints(props.exercises);
    return (
        <>
            <TestPageLayout studentEmail="-" title={props.title} highlightedResult={totalResult}>
                <DragDropContext onDragEnd={handleExercisesDragEnd}>
                    <Droppable droppableId="droppable-exercise">
                        {(droppableExerciseProvided) => (
                            <PageContent
                                ref={droppableExerciseProvided.innerRef}
                                {...droppableExerciseProvided.droppableProps}
                            >
                                {orderedExercises.map((exercise, exerciseIndex) => {
                                    const exerciseIndication = { hideMark: true };

                                    return (
                                        <Draggable
                                            key={'exercise-' + exercise.id}
                                            draggableId={'exercise-' + exercise.id}
                                            index={exerciseIndex}
                                        >
                                            {(draggableExerciseProvided) => (
                                                <>
                                                    <ExerciseMainContainer
                                                        ref={draggableExerciseProvided.innerRef}
                                                        {...draggableExerciseProvided.draggableProps}
                                                    >
                                                        <ExerciseIconsContainer>
                                                            <Tooltip title="Maintenez le clic enfoncé pour déplacer l'exercice">
                                                                <MuiIconButton
                                                                    {...draggableExerciseProvided.dragHandleProps}
                                                                >
                                                                    <DragIndicatorIcon />
                                                                </MuiIconButton>
                                                            </Tooltip>
                                                            <IconButton
                                                                IconComponent={EditIcon}
                                                                title="Éditer l'exercice"
                                                                onClick={buildOpenExerciseEditionModal(
                                                                    exercise,
                                                                )}
                                                            />
                                                        </ExerciseIconsContainer>
                                                        <ExerciseContainer
                                                            isExpanded={
                                                                currentExerciseExpanded ===
                                                                exercise.id
                                                            }
                                                            onChangeExpanded={buildOnExerciseExpandedChange(
                                                                exercise.id,
                                                            )}
                                                            key={`exercise-${exercise.id}`}
                                                            exercise={exercise}
                                                            indication={exerciseIndication}
                                                        >
                                                            <DragDropContext
                                                                onDragEnd={(result) =>
                                                                    handleQuestionsDragEnd(
                                                                        result,
                                                                        exercise.id,
                                                                    )
                                                                }
                                                            >
                                                                <Droppable droppableId="droppable-question">
                                                                    {(
                                                                        droppableQuestionProvided,
                                                                    ) => {
                                                                        const ids =
                                                                            orderedQuestionIds[
                                                                                exercise.id
                                                                            ] || [];
                                                                        const orderedQuestions =
                                                                            computeOrderedItems(
                                                                                ids,
                                                                                exercise.questions,
                                                                            );

                                                                        return (
                                                                            <QuestionsContainer
                                                                                ref={
                                                                                    droppableQuestionProvided.innerRef
                                                                                }
                                                                                {...droppableQuestionProvided.droppableProps}
                                                                            >
                                                                                {orderedQuestions.map(
                                                                                    (
                                                                                        question,
                                                                                        questionIndex,
                                                                                    ) => (
                                                                                        <QuestionMainContainer
                                                                                            key={`question-${question.id}`}
                                                                                        >
                                                                                            <Draggable
                                                                                                key={
                                                                                                    'question-' +
                                                                                                    question.id
                                                                                                }
                                                                                                draggableId={
                                                                                                    'question-' +
                                                                                                    question.id
                                                                                                }
                                                                                                index={
                                                                                                    questionIndex
                                                                                                }
                                                                                            >
                                                                                                {(
                                                                                                    draggableQuestionProvided,
                                                                                                ) => (
                                                                                                    <QuestionContainer
                                                                                                        ref={
                                                                                                            draggableQuestionProvided.innerRef
                                                                                                        }
                                                                                                        {...draggableQuestionProvided.draggableProps}
                                                                                                    >
                                                                                                        <QuestionDragIconContainer>
                                                                                                            <Tooltip title="Maintenez le clic enfoncé pour déplacer la question">
                                                                                                                <MuiIconButton
                                                                                                                    {...draggableQuestionProvided.dragHandleProps}
                                                                                                                >
                                                                                                                    <DragIndicatorIcon />
                                                                                                                </MuiIconButton>
                                                                                                            </Tooltip>
                                                                                                        </QuestionDragIconContainer>
                                                                                                        <QuestionViewMode
                                                                                                            onDeleteQuestion={buildOnDeleteQuestion(
                                                                                                                exercise.id,
                                                                                                                question.id,
                                                                                                            )}
                                                                                                            question={
                                                                                                                question
                                                                                                            }
                                                                                                            index={
                                                                                                                questionIndex +
                                                                                                                1
                                                                                                            }
                                                                                                            examId={
                                                                                                                props.examId
                                                                                                            }
                                                                                                            exerciseId={
                                                                                                                exercise.id
                                                                                                            }
                                                                                                        />
                                                                                                    </QuestionContainer>
                                                                                                )}
                                                                                            </Draggable>
                                                                                            {questionIndex <
                                                                                                exercise
                                                                                                    .questions
                                                                                                    .length -
                                                                                                    1 && (
                                                                                                <LightHorizontalDivider />
                                                                                            )}
                                                                                        </QuestionMainContainer>
                                                                                    ),
                                                                                )}
                                                                                {
                                                                                    droppableQuestionProvided.placeholder
                                                                                }
                                                                                <HorizontalDividerToAddQuestion
                                                                                    onClick={buildOpenQuestionCreationModal(
                                                                                        exercise,
                                                                                    )}
                                                                                />
                                                                            </QuestionsContainer>
                                                                        );
                                                                    }}
                                                                </Droppable>
                                                            </DragDropContext>
                                                        </ExerciseContainer>
                                                        <ExerciseIconsContainer>
                                                            <IconButton
                                                                color="error"
                                                                IconComponent={DeleteForeverIcon}
                                                                title="Supprimer l'exercice"
                                                                onClick={buildDeleteExercise(
                                                                    exercise.id,
                                                                    exercise.name,
                                                                )}
                                                            />
                                                        </ExerciseIconsContainer>
                                                    </ExerciseMainContainer>
                                                    {exerciseIndex <
                                                        orderedExercises.length - 1 && (
                                                        <HorizontalDivider />
                                                    )}
                                                </>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {droppableExerciseProvided.placeholder}
                                <HorizontalDividerToAddExercise
                                    onClick={buildOpenExerciseCreationModal()}
                                />
                            </PageContent>
                        )}
                    </Droppable>
                </DragDropContext>
            </TestPageLayout>

            {!!exerciseUpsertionModalStatus && (
                <ExerciseUpsertionModal
                    onCreateExercise={onCreateExercise}
                    examId={props.examId}
                    close={closeExerciseUpsertionModal}
                    modalStatus={exerciseUpsertionModalStatus}
                />
            )}
            {!!questionUpsertionModalStatus && (
                <QuestionUpsertionModal
                    examId={props.examId}
                    onCreateQuestion={onCreateQuestion}
                    close={closeQuestionUpsertionModal}
                    modalStatus={questionUpsertionModalStatus}
                    defaultPoints={questionUpsertionModalStatus.exercise.defaultPoints}
                    defaultQuestionKind={questionUpsertionModalStatus.exercise.defaultQuestionKind}
                    exerciseId={questionUpsertionModalStatus.exercise.id}
                />
            )}
        </>
    );

    function handleQuestionsDragEnd(
        result: DropResult,
        exerciseId: number,
    ): ReturnType<OnDragEndResponder> {
        if (!result.destination) {
            return;
        }
        if (result.destination.index === result.source.index) {
            return;
        }
        const newQuestionIds = tableHandler.shift(
            orderedQuestionIds[exerciseId],
            result.source.index,
            result.destination.index,
        );
        setOrderedQuestionIds({ ...orderedQuestionIds, [exerciseId]: newQuestionIds });
        updateQuestionsOrderMutation.mutate({
            examId: props.examId,
            exerciseId: exerciseId,
            orderedIds: newQuestionIds,
        });
    }

    function handleExercisesDragEnd(result: DropResult): ReturnType<OnDragEndResponder> {
        if (!result.destination) {
            return;
        }
        if (result.destination.index === result.source.index) {
            return;
        }
        const newExerciseIds = tableHandler.shift(
            orderedExerciseIds,
            result.source.index,
            result.destination.index,
        );
        setOrderedExerciseIds(newExerciseIds);
        updateExercisesOrderMutation.mutate({
            examId: props.examId,
            orderedIds: newExerciseIds,
        });
    }

    function buildOpenQuestionCreationModal(exercise: exerciseWithQuestionsType) {
        return () => {
            setQuestionUpsertionModalStatus({
                kind: 'creating',
                exercise: {
                    id: exercise.id,
                    defaultPoints: exercise.defaultPoints,
                    defaultQuestionKind: exercise.defaultQuestionKind,
                },
            });
        };
    }

    function buildOpenExerciseCreationModal() {
        return () => {
            setExerciseUpsertionModalStatus({ kind: 'creating' });
        };
    }

    function buildOpenExerciseEditionModal(exercise: exerciseWithQuestionsType) {
        return () => {
            setExerciseUpsertionModalStatus({ kind: 'editing', exercise });
        };
    }

    function closeExerciseUpsertionModal() {
        setExerciseUpsertionModalStatus(undefined);
    }

    function closeQuestionUpsertionModal() {
        setQuestionUpsertionModalStatus(undefined);
    }

    function buildOnExerciseExpandedChange(exerciseId: number) {
        return (_: any, isExpanded: boolean) => {
            setCurrentExerciseExpanded(isExpanded ? exerciseId : undefined);
        };
    }

    function buildOnDeleteQuestion(exerciseId: number, deletedQuestionId: number) {
        return () => {
            const newOrderedQuestionIds = orderedQuestionIds[exerciseId].filter(
                (currentQuestionId) => currentQuestionId !== deletedQuestionId,
            );
            setOrderedQuestionIds({ ...orderedQuestionIds, [exerciseId]: newOrderedQuestionIds });
        };
    }

    function onCreateQuestion(exerciseId: number, createdQuestionId: number) {
        const newOrderedQuestionIds = {
            ...orderedQuestionIds,
            [exerciseId]: [...orderedQuestionIds[exerciseId], createdQuestionId],
        };
        setOrderedQuestionIds(newOrderedQuestionIds);
    }

    function onCreateExercise(createdExerciseId: number) {
        const newOrderedExerciseIds = [...orderedExerciseIds, createdExerciseId];
        setOrderedExerciseIds(newOrderedExerciseIds);
    }

    function buildDeleteExercise(exerciseId: number, exerciseName: string) {
        return () => {
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm(
                `Souhaitez-vous réellement supprimer l'exercice "${exerciseName}" ? Tous les résultats des élèves pour cet exercice seront supprimés.`,
            );
            if (hasConfirmed) {
                deleteExerciseMutation.mutate({ examId: props.examId, exerciseId });
            }
        };
    }
}

function computeOrderedQuestionIds(exercises: exerciseWithQuestionsType[]) {
    return exercises.reduce((acc, exercise) => {
        return {
            ...acc,
            [exercise.id]: [...exercise.questions.map((question) => question.id)],
        };
    }, {} as Record<number, number[]>);
}

const QuestionsContainer = styled('div')({});
const QuestionDragIconContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    paddingTop: theme.spacing(3),
    alignItems: 'flex-start',
}));
const QuestionContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
}));
const QuestionMainContainer = styled('div')(({ theme }) => ({}));
const ExerciseMainContainer = styled('div')(({ theme }) => ({
    display: 'flex',
}));
const ExerciseIconsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    height: EXERCISE_ACCORDION_SUMMARY_HEIGHT,
}));
const PageContent = styled('div')({});

export { QuestionsEditing };
