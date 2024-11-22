import { TestPageLayout } from '../components/TestPageLayout';
import { useEffect, useState } from 'react';
import { EXERCISE_ACCORDION_SUMMARY_HEIGHT } from '../components/ExerciseContainer';
import { computeTotalPoints } from '../lib/computeTotalPoints';
import { exerciseUpsertionModalStatusType, exerciseWithQuestionsType } from './types';
import { HorizontalDividerToAddExercise } from './HorizontalDividers';
import { ExerciseUpsertionModal } from './ExerciseUpsertionModal';
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
import { HorizontalDivider } from '../../../components/HorizontalDivider';
import { useAlert } from '../../../lib/alert';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { computeOrderedItems } from './lib/computeOrderedItems';
import { IconButton } from '../../../components/IconButton';
import { ExerciseEditing } from './ExerciseEditing';
import { exercisesApi } from '../../../lib/api/exercisesApi';
import { ExerciseImportModal } from './ExerciseImportModal';

function ExercisesEditing(props: {
    title: string;
    examId: string;
    exercises: Array<exerciseWithQuestionsType>;
}) {
    const { displayAlert } = useAlert();
    const [currentExerciseExpanded, setCurrentExerciseExpanded] = useState<number | undefined>();
    const [exerciseUpsertionModalStatus, setExerciseUpsertionModalStatus] = useState<
        exerciseUpsertionModalStatusType | undefined
    >(undefined);
    const [isExerciseImportModalOpen, setIsExerciseImportModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const updateExercisesOrderMutation = useMutation({
        mutationFn: exercisesApi.updateExercisesOrder,
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
    const deleteExerciseMutation = useMutation({
        mutationFn: exercisesApi.deleteExercise,
        onSuccess: (deletedExercise: { id: number }) => {
            setOrderedExerciseIds(
                orderedExerciseIds.filter((exerciseId) => exerciseId !== deletedExercise.id),
            );
            displayAlert({ variant: 'success', text: "L'exercice a été supprimé." });
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId, 'with-questions'] });
        },
        onError: () => {
            displayAlert({
                variant: 'error',
                text: "L'exercise n'a pas pu être supprimé. Veuillez recharger la page.",
            });
        },
    });

    useEffect(() => {
        const exerciseIds = props.exercises.map((exercise) => exercise.id);
        setOrderedExerciseIds(exerciseIds);
    }, [props.exercises]);

    const initialOrderedExerciseIds = props.exercises.map((exercise) => exercise.id);
    const [orderedExerciseIds, setOrderedExerciseIds] = useState(initialOrderedExerciseIds);

    const orderedExercises = computeOrderedItems(orderedExerciseIds, props.exercises);
    const totalResult = computeTotalPoints(props.exercises);
    return (
        <>
            <TestPageLayout title={props.title} highlightedResult={totalResult}>
                <DragDropContext onDragEnd={handleExercisesDragEnd}>
                    <Droppable droppableId="droppable-exercise">
                        {(droppableExerciseProvided) => (
                            <PageContent
                                ref={droppableExerciseProvided.innerRef}
                                {...droppableExerciseProvided.droppableProps}
                            >
                                {orderedExercises.map((exercise, exerciseIndex) => {
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
                                                        <ExerciseEditing
                                                            examId={props.examId}
                                                            exercise={exercise}
                                                            onExerciseExpandedChange={buildOnExerciseExpandedChange(
                                                                exercise.id,
                                                            )}
                                                            isExpanded={
                                                                currentExerciseExpanded ===
                                                                exercise.id
                                                            }
                                                        />

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
                                    onCreateExerciseClick={openExerciseCreationModal}
                                    onImportExerciseClick={openExerciseImportModal}
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

            <ExerciseImportModal
                examId={props.examId}
                close={closeExerciseImportModal}
                isOpen={isExerciseImportModalOpen}
            />
        </>
    );

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

    function openExerciseCreationModal() {
        setExerciseUpsertionModalStatus({ kind: 'creating' });
    }

    function openExerciseImportModal() {
        setIsExerciseImportModalOpen(true);
    }

    function closeExerciseImportModal() {
        setIsExerciseImportModalOpen(false);
    }

    function buildOpenExerciseEditionModal(exercise: exerciseWithQuestionsType) {
        return () => {
            setExerciseUpsertionModalStatus({ kind: 'editing', exercise });
        };
    }

    function closeExerciseUpsertionModal() {
        setExerciseUpsertionModalStatus(undefined);
    }

    function buildOnExerciseExpandedChange(exerciseId: number) {
        return (_: any, isExpanded: boolean) => {
            setCurrentExerciseExpanded(isExpanded ? exerciseId : undefined);
        };
    }

    function onCreateExercise(createdExerciseId: number) {
        setCurrentExerciseExpanded(createdExerciseId);
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

const ExerciseMainContainer = styled('div')(({ theme }) => ({
    display: 'flex',
}));
const ExerciseIconsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    height: EXERCISE_ACCORDION_SUMMARY_HEIGHT,
}));
const PageContent = styled('div')({});

export { ExercisesEditing };
