import { useEffect, useState } from 'react';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    styled,
} from '@mui/material';
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
    OnDragEndResponder,
} from 'react-beautiful-dnd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import EditIcon from '@mui/icons-material/Edit';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { exerciseType } from './types';
import { tableHandler } from '../../lib/tableHandler';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { questionSpecificityMapping } from '../../constants';

function ExercisesTable(props: {
    examId: string;
    exercises: Array<exerciseType>;
    openEditionModal: (exercise: exerciseType) => void;
}) {
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [exercises, setExercises] = useState(props.exercises);
    const swapExercisesMutation = useMutation({
        mutationFn: api.swapExercises,
        onError: () => {
            displayAlert({
                variant: 'error',
                text: "Votre dernière modification n'a pas pu être enregistrée. Veuillez recharger la page.",
            });
        },
    });
    const deleteExerciseMutation = useMutation({
        mutationFn: api.deleteExercise,
        onSuccess: () => {
            displayAlert({ variant: 'success', text: "L'exercice a été supprimé." });
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });

    useEffect(() => {
        setExercises(props.exercises);
    }, [props.exercises]);

    return (
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell width={20}>N°</TableCell>
                    <TableCell width={160}>Actions</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Type de questions</TableCell>
                </TableRow>
            </TableHead>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                            {exercises.map((exercise, index) => {
                                const { IconComponent: DefaultQuestionKindIconComponent } =
                                    questionSpecificityMapping[exercise.defaultQuestionKind];
                                return (
                                    <Draggable
                                        key={'exercise-' + exercise.id}
                                        draggableId={'exercise-' + exercise.id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <TableRow
                                                key={`exercise-row-${exercise.id}`}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    <Tooltip title="Modifier l'ordre">
                                                        <IconButton {...provided.dragHandleProps}>
                                                            <DragIndicatorIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Accéder à la liste des questions">
                                                        <IconButton
                                                            onClick={buildNavigateToExerciseOnClick(
                                                                exercise.id,
                                                            )}
                                                        >
                                                            <FormatListBulletedIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Éditer l'exercice">
                                                        <IconButton
                                                            onClick={buildEditExerciseOnClick(
                                                                exercise,
                                                            )}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Supprimer l'exercice">
                                                        <IconButton
                                                            onClick={buildDeleteExercise(
                                                                exercise.id,
                                                            )}
                                                        >
                                                            <DeleteForeverIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>

                                                <TableCell>{exercise.name}</TableCell>
                                                <TableCell>
                                                    <QuestionKindCellContent>
                                                        <QuestionKindIconContainer>
                                                            <DefaultQuestionKindIconComponent />
                                                        </QuestionKindIconContainer>
                                                        {
                                                            questionSpecificityMapping[
                                                                exercise.defaultQuestionKind
                                                            ].label
                                                        }
                                                    </QuestionKindCellContent>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </TableBody>
                    )}
                </Droppable>
            </DragDropContext>
        </Table>
    );

    function buildEditExerciseOnClick(exercise: exerciseType) {
        return () => {
            props.openEditionModal(exercise);
        };
    }

    function buildNavigateToExerciseOnClick(exerciseId: number) {
        return () => {
            navigate(`/teacher/exams/${props.examId}/exercises/${exerciseId}`);
        };
    }

    function handleDragEnd(result: DropResult): ReturnType<OnDragEndResponder> {
        if (!result.destination) {
            return;
        }
        const exerciseId1 = exercises[result.source.index].id;
        const exerciseId2 = exercises[result.destination.index].id;
        const newExercises = tableHandler.swap(
            exercises,
            result.source.index,
            result.destination.index,
        );

        setExercises(newExercises);
        swapExercisesMutation.mutate({ examId: props.examId, exerciseId1, exerciseId2 });
    }

    function buildDeleteExercise(exerciseId: number) {
        return () => {
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm(
                'Souhaitez-vous réellement supprimer cet exercice ? Tous les résultats des élèves pour cet exercice seront supprimés.',
            );
            if (hasConfirmed) {
                deleteExerciseMutation.mutate({ examId: props.examId, exerciseId });
            }
        };
    }
}

const QuestionKindCellContent = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

const QuestionKindIconContainer = styled('div')(({ theme }) => ({
    marginRight: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
}));

export { ExercisesTable };
