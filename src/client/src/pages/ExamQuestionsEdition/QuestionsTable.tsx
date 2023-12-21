import { useEffect, useState } from 'react';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    Tooltip,
    styled,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import { questionWithAnswersType } from './types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { api } from '../../lib/api';
import { tableHandler } from '../../lib/tableHandler';
import { useAlert } from '../../lib/alert';
import { questionSpecificityMapping } from '../../constants';

function QuestionsTable(props: {
    examId: string;
    exerciseId: number;
    questions: Array<questionWithAnswersType>;
    openEditionModal: (question: questionWithAnswersType) => void;
}) {
    const { displayAlert } = useAlert();

    const queryClient = useQueryClient();
    const deleteQuestionMutation = useMutation({
        mutationFn: api.deleteQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['exams', props.examId, 'exercises', props.exerciseId],
            });
            displayAlert({ variant: 'success', text: 'La question a été supprimée.' });
        },
    });
    const duplicateQuestionMutation = useMutation({
        mutationFn: api.duplicateQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['exams', props.examId, 'exercises', props.exerciseId],
            });
            displayAlert({ variant: 'success', text: 'La question a été dupliquée.' });
        },
    });
    const updateQuestionsOrderMutation = useMutation({
        mutationFn: api.updateQuestionsOrder,
        onError: () => {
            displayAlert({
                variant: 'error',
                text: "Votre dernière modification n'a pas pu être enregistrée. Veuillez recharger la page.",
            });
        },
    });
    const [questions, setQuestions] = useState(props.questions);
    const totalPoints = props.questions.reduce(
        (sum: number, question: { points: number }) => sum + question.points,
        0,
    );

    useEffect(() => {
        setQuestions(props.questions);
    }, [props.questions]);

    const handleDragEnd: OnDragEndResponder = (result) => {
        if (!result.destination) {
            return;
        }
        if (result.destination.index === result.source.index) {
            return;
        }
        const newQuestions = tableHandler.shift(
            questions,
            result.source.index,
            result.destination.index,
        );
        setQuestions(newQuestions);
        const orders = newQuestions.map((question, index) => ({ id: question.id, order: index }));

        updateQuestionsOrderMutation.mutate({
            examId: props.examId,
            exerciseId: props.exerciseId,
            orders,
        });
    };
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell width={20}>N°</TableCell>
                    <TableCell width={160}>Actions</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Intitulé</TableCell>
                    <TableCell>Réponses acceptées</TableCell>
                    <TableCell>Points</TableCell>
                </TableRow>
            </TableHead>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                            {questions.map((question, index) => {
                                const QuestionKindIconComponent =
                                    questionSpecificityMapping[question.kind].IconComponent;
                                return (
                                    <Draggable
                                        key={'question-' + question.id}
                                        draggableId={'question-' + question.id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <TableRow
                                                key={`question-row-${question.id}`}
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
                                                    <Tooltip title="Éditer la question">
                                                        <IconButton
                                                            onClick={buildEditQuestionOnClick(
                                                                question,
                                                            )}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Dupliquer la question">
                                                        <IconButton
                                                            onClick={buildDuplicateQuestionOnClick(
                                                                question,
                                                            )}
                                                        >
                                                            <ContentCopyIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Supprimer la question">
                                                        <IconButton
                                                            onClick={buildDeleteQuestionOnClick(
                                                                question,
                                                            )}
                                                        >
                                                            <DeleteForeverIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>
                                                    <CenteredHorizontalCellContent>
                                                        <QuestionTypeIconContainer>
                                                            <QuestionKindIconComponent />
                                                        </QuestionTypeIconContainer>
                                                        {
                                                            questionSpecificityMapping[
                                                                question.kind
                                                            ].label
                                                        }
                                                    </CenteredHorizontalCellContent>
                                                </TableCell>
                                                <TableCell>
                                                    <CenteredVerticalCellContent>
                                                        {question.title}
                                                        {!!question.possibleAnswers && (
                                                            <ul>
                                                                {question.possibleAnswers.map(
                                                                    (
                                                                        possibleAnswer: string,
                                                                        index,
                                                                    ) => (
                                                                        <li
                                                                            key={`question-${question.id}-${index}`}
                                                                        >
                                                                            {possibleAnswer}
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        )}
                                                    </CenteredVerticalCellContent>
                                                </TableCell>
                                                <TableCell>
                                                    {question.kind === 'qcm' &&
                                                    question.possibleAnswers ? (
                                                        question.possibleAnswers[
                                                            Number(
                                                                question
                                                                    .acceptableAnswersWithPoints[0][0]
                                                                    .answer,
                                                            )
                                                        ]
                                                    ) : (
                                                        <ul>
                                                            {question.acceptableAnswersWithPoints[0].map(
                                                                (
                                                                    acceptableAnswerWithPoint,
                                                                    index: number,
                                                                ) => (
                                                                    <li
                                                                        key={`question-right-answers-${question.id}-${index}`}
                                                                    >
                                                                        (
                                                                        {
                                                                            acceptableAnswerWithPoint.points
                                                                        }
                                                                        ) -{' '}
                                                                        {
                                                                            acceptableAnswerWithPoint.answer
                                                                        }
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    )}
                                                </TableCell>

                                                <TableCell>{question.points}</TableCell>
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
            <TableFooter>
                <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell>{totalPoints}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );

    function buildEditQuestionOnClick(question: questionWithAnswersType) {
        return () => {
            props.openEditionModal(question);
        };
    }

    function buildDuplicateQuestionOnClick(question: questionWithAnswersType) {
        return () => {
            duplicateQuestionMutation.mutate({
                examId: props.examId,
                questionId: question.id,
                exerciseId: props.exerciseId,
            });
        };
    }

    function buildDeleteQuestionOnClick(question: questionWithAnswersType) {
        return () => {
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm(
                'Souhaitez-vous réellement supprimer cette question ? Toutes les réponses associées à cette question seront également supprimées.',
            );
            if (hasConfirmed) {
                deleteQuestionMutation.mutate({ examId: props.examId, questionId: question.id });
            }
        };
    }
}

const CenteredVerticalCellContent = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
});

const CenteredHorizontalCellContent = styled('div')({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
});

const QuestionTypeIconContainer = styled('div')(({ theme }) => ({
    marginRight: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
}));
export { QuestionsTable };
