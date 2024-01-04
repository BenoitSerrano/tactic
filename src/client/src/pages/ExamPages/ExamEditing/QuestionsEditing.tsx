import { TestPageLayout } from '../components/TestPageLayout';
import { useState } from 'react';
import { ExerciseContainer } from '../components/ExerciseContainer';
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

import { tableHandler } from '../../../lib/tableHandler';
import { IconButton, styled } from '@mui/material';
import { LightHorizontalDivider } from '../../../components/HorizontalDivider';
import { api } from '../../../lib/api';
import { useAlert } from '../../../lib/alert';
import { useMutation } from '@tanstack/react-query';
import { computeOrderedItems } from './lib/computeOrderedItems';

function QuestionsEditing(props: {
    title: string;
    examId: string;
    exercises: Array<exerciseWithQuestionsType>;
}) {
    const { displayAlert } = useAlert();
    const [currentExerciseExpanded, setCurrentExerciseExpanded] = useState<number | undefined>(
        undefined,
    );
    const [exerciseUpsertionModalStatus, setExerciseUpsertionModalStatus] = useState<
        exerciseUpsertionModalStatusType | undefined
    >(undefined);
    const [questionUpsertionModalStatus, setQuestionUpsertionModalStatus] = useState<
        questionUpsertionModalStatusType | undefined
    >(undefined);
    const updateQuestionsOrderMutation = useMutation({
        mutationFn: api.updateQuestionsOrder,
        onError: () => {
            displayAlert({
                variant: 'error',
                text: "La question n'a pas pu être déplacée. Veuillez recharger la page.",
            });
        },
    });
    const initialOrderedExerciseIds = props.exercises.map((exercise) => exercise.id);
    const [orderedExerciseIds, setOrderedExerciseIds] = useState(initialOrderedExerciseIds);
    const initialOrderedQuestionIds = props.exercises.reduce((acc, exercise) => {
        return {
            ...acc,
            [exercise.id]: [...exercise.questions.map((question) => question.id)],
        };
    }, {} as Record<number, number[]>);
    const [orderedQuestionIds, setOrderedQuestionIds] = useState(initialOrderedQuestionIds);
    const orderedExercises = computeOrderedItems(orderedExerciseIds, props.exercises);

    const totalPoints = computeTotalPoints(props.exercises);
    return (
        <>
            <TestPageLayout studentEmail="-" title={props.title} result={totalPoints}>
                {orderedExercises.map((exercise) => {
                    const exerciseIndication = { hideMark: true };

                    return (
                        <ExerciseContainer
                            isExpanded={currentExerciseExpanded === exercise.id}
                            onChangeExpanded={buildOnExerciseExpandedChange(exercise.id)}
                            key={`exercise-${exercise.id}`}
                            exercise={exercise}
                            indication={exerciseIndication}
                        >
                            <DragDropContext
                                onDragEnd={(result) => handleQuestionsDragEnd(result, exercise.id)}
                            >
                                <Droppable droppableId="droppable-question">
                                    {(provided) => {
                                        const orderedQuestions = computeOrderedItems(
                                            orderedQuestionIds[exercise.id],
                                            exercise.questions,
                                        );

                                        return (
                                            <QuestionsContainer
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                {orderedQuestions.map((question, questionIndex) => (
                                                    <QuestionMainContainer
                                                        key={`question-${question.id}`}
                                                    >
                                                        <Draggable
                                                            key={'question-' + question.id}
                                                            draggableId={'question-' + question.id}
                                                            index={questionIndex}
                                                        >
                                                            {(provided) => (
                                                                <QuestionContainer
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                >
                                                                    <DragIconContainer>
                                                                        <IconButton
                                                                            {...provided.dragHandleProps}
                                                                        >
                                                                            <DragIndicatorIcon />
                                                                        </IconButton>
                                                                    </DragIconContainer>
                                                                    <QuestionViewMode
                                                                        onDeleteQuestion={buildOnDeleteQuestion(
                                                                            exercise.id,
                                                                            question.id,
                                                                        )}
                                                                        question={question}
                                                                        index={questionIndex + 1}
                                                                        examId={props.examId}
                                                                        exerciseId={exercise.id}
                                                                    />
                                                                </QuestionContainer>
                                                            )}
                                                        </Draggable>
                                                        {questionIndex <
                                                            exercise.questions.length - 1 && (
                                                            <LightHorizontalDivider />
                                                        )}
                                                    </QuestionMainContainer>
                                                ))}
                                                {provided.placeholder}
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
                    );
                })}
                <HorizontalDividerToAddExercise onClick={buildOpenExerciseCreationModal()} />
            </TestPageLayout>
            {!!exerciseUpsertionModalStatus && (
                <ExerciseUpsertionModal
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

    function onCreateQuestion(exerciseId: number, addedQuestionId: number) {
        const newOrderedQuestionIds = {
            ...orderedQuestionIds,
            [exerciseId]: [...orderedQuestionIds[exerciseId], addedQuestionId],
        };
        setOrderedQuestionIds(newOrderedQuestionIds);
    }
}

const QuestionsContainer = styled('div')({});
const DragIconContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    paddingTop: theme.spacing(3),
    alignItems: 'flex-start',
}));
const QuestionContainer = styled('div')(({ theme }) => ({
    display: 'flex',
}));
const QuestionMainContainer = styled('div')(({ theme }) => ({}));

export { QuestionsEditing };
