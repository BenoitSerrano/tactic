import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
    OnDragEndResponder,
} from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { ExerciseAccordionContainer } from '../components/ExerciseAccordionContainer';
import { exerciseWithQuestionsType, questionType, questionUpsertionModalStatusType } from './types';
import { tableHandler } from '../../../lib/tableHandler';
import { useEffect, useState } from 'react';
import { computeOrderedItems } from './lib/computeOrderedItems';
import { IconButton as MuiIconButton, Tooltip, styled } from '@mui/material';
import { QuestionPreviewing } from './QuestionPreviewing/QuestionPreviewing';
import { LightHorizontalDivider } from '../../../components/HorizontalDivider';
import { HorizontalDividerToAddQuestion } from './HorizontalDividers';
import { QuestionUpsertionModal } from './QuestionUpsertionModal/QuestionUpsertionModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../../lib/alert';
import { questionsApi } from '../../../lib/api/questionsApi';

function ExerciseEditing(props: {
    isExpanded: boolean;
    exercise: exerciseWithQuestionsType;
    onExerciseExpandedChange: (_: any, isExpanded: boolean) => void;
    examId: string;
}) {
    const exerciseIndication = { hideMark: true };
    const initialOrderedQuestionIds = computeOrderedQuestionIds(props.exercise);
    const { displayAlert } = useAlert();
    const [questionUpsertionModalStatus, setQuestionUpsertionModalStatus] = useState<
        questionUpsertionModalStatusType | undefined
    >();
    const queryClient = useQueryClient();
    const [orderedQuestionIds, setOrderedQuestionIds] = useState(initialOrderedQuestionIds);
    const updateQuestionsOrderMutation = useMutation({
        mutationFn: questionsApi.updateQuestionsOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId, 'with-questions'] });
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: "La question n'a pas pu être déplacée. Veuillez recharger la page.",
            });
        },
    });
    useEffect(() => {
        const newOrderedQuestionIds = computeOrderedQuestionIds(props.exercise);
        setOrderedQuestionIds(newOrderedQuestionIds);
    }, [props.exercise]);
    return (
        <ExerciseAccordionContainer
            isExpanded={props.isExpanded}
            onChangeExpanded={props.onExerciseExpandedChange}
            key={`exercise-${props.exercise.id}`}
            exercise={props.exercise}
            indication={exerciseIndication}
        >
            <DragDropContext onDragEnd={handleQuestionsDragEnd}>
                <Droppable droppableId="droppable-question">
                    {(droppableQuestionProvided) => {
                        const ids = orderedQuestionIds || [];
                        const orderedQuestions = computeOrderedItems(ids, props.exercise.questions);
                        return (
                            <QuestionsContainer
                                ref={droppableQuestionProvided.innerRef}
                                {...droppableQuestionProvided.droppableProps}
                            >
                                {orderedQuestions.map((question, questionIndex) => (
                                    <QuestionMainContainer key={`question-${question.id}`}>
                                        <Draggable
                                            key={'question-' + question.id}
                                            draggableId={'question-' + question.id}
                                            index={questionIndex}
                                        >
                                            {(draggableQuestionProvided) => (
                                                <QuestionContainer
                                                    ref={draggableQuestionProvided.innerRef}
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
                                                    <QuestionPreviewing
                                                        openEditingModal={() =>
                                                            openQuestionEditingModal(question)
                                                        }
                                                        onDeleteQuestion={buildOnDeleteQuestion(
                                                            question.id,
                                                        )}
                                                        question={question}
                                                        index={questionIndex + 1}
                                                        examId={props.examId}
                                                        exerciseId={props.exercise.id}
                                                    />
                                                </QuestionContainer>
                                            )}
                                        </Draggable>
                                        {questionIndex < props.exercise.questions.length - 1 && (
                                            <LightHorizontalDivider />
                                        )}
                                    </QuestionMainContainer>
                                ))}
                                {droppableQuestionProvided.placeholder}
                                <HorizontalDividerToAddQuestion
                                    onClick={openQuestionCreationModal}
                                />
                            </QuestionsContainer>
                        );
                    }}
                </Droppable>
            </DragDropContext>
            {!!questionUpsertionModalStatus && (
                <QuestionUpsertionModal
                    examId={props.examId}
                    onCreateQuestion={onCreateQuestion}
                    close={closeQuestionUpsertionModal}
                    modalStatus={questionUpsertionModalStatus}
                    defaultPoints={props.exercise.defaultPoints}
                    defaultQuestionKind={props.exercise.defaultQuestionKind}
                    exerciseId={props.exercise.id}
                />
            )}
        </ExerciseAccordionContainer>
    );

    function openQuestionEditingModal(question: questionType) {
        setQuestionUpsertionModalStatus({ kind: 'editing', question });
    }

    function closeQuestionUpsertionModal() {
        setQuestionUpsertionModalStatus(undefined);
    }

    function onCreateQuestion(createdQuestionId: number) {
        setOrderedQuestionIds([...orderedQuestionIds, createdQuestionId]);
    }

    function handleQuestionsDragEnd(result: DropResult): ReturnType<OnDragEndResponder> {
        if (!result.destination) {
            return;
        }
        if (result.destination.index === result.source.index) {
            return;
        }
        const newQuestionIds = tableHandler.shift(
            orderedQuestionIds,
            result.source.index,
            result.destination.index,
        );
        setOrderedQuestionIds(newQuestionIds);
        updateQuestionsOrderMutation.mutate({
            examId: props.examId,
            exerciseId: props.exercise.id,
            orderedIds: newQuestionIds,
        });
    }

    function computeOrderedQuestionIds(exercise: exerciseWithQuestionsType) {
        return exercise.questions.map((question) => question.id);
    }

    function buildOnDeleteQuestion(deletedQuestionId: number) {
        return () => {
            const newOrderedQuestionIds = orderedQuestionIds.filter(
                (currentQuestionId) => currentQuestionId !== deletedQuestionId,
            );
            setOrderedQuestionIds(newOrderedQuestionIds);
        };
    }
    function openQuestionCreationModal() {
        setQuestionUpsertionModalStatus({
            kind: 'creating',
        });
    }
}

const QuestionsContainer = styled('div')({});
const QuestionMainContainer = styled('div')(({ theme }) => ({}));
const QuestionContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
}));
const QuestionDragIconContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    paddingTop: theme.spacing(3),
    alignItems: 'flex-start',
}));

export { ExerciseEditing };
