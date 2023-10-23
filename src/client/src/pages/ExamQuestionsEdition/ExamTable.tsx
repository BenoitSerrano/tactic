import React, { useEffect, useState } from 'react';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    styled,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import { questionWithAnswersType } from './types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { api } from '../../lib/api';
import { questionSpecicityMapping } from './constants';
import { tableHandler } from '../../lib/tableHandler';
import { useAlert } from '../../lib/alert';

function ExamTable(props: {
    examId: string;
    questions: Array<questionWithAnswersType>;
    openEditionModal: (question: questionWithAnswersType) => void;
}) {
    const { displayAlert } = useAlert();

    const queryClient = useQueryClient();
    const deleteQuestionMutation = useMutation({
        mutationFn: api.deleteQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });
    const swapQuestionsMutation = useMutation({
        mutationFn: api.swapQuestions,
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
        const questionId1 = questions[result.source.index].id;
        const questionId2 = questions[result.destination.index].id;
        const newQuestions = tableHandler.swap(
            questions,
            result.source.index,
            result.destination.index,
        );

        setQuestions(newQuestions);
        swapQuestionsMutation.mutate({ questionId1, questionId2 });
    };
    return (
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell width={20}>N°</TableCell>
                    <TableCell width={130}>Actions</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Intitulé</TableCell>
                    <TableCell>Bonne(s) réponse(s)</TableCell>
                    <TableCell>Réponse(s) acceptée(s)</TableCell>
                    <TableCell>Points</TableCell>
                </TableRow>
            </TableHead>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                            {questions.map((question, index) => {
                                const QuestionKindIconComponent =
                                    questionSpecicityMapping[question.kind].IconComponent;
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
                                                    <IconButton {...provided.dragHandleProps}>
                                                        <DragIndicatorIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={buildEditQuestionOnClick(question)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={buildDeleteQuestionOnClick(
                                                            question,
                                                        )}
                                                    >
                                                        <DeleteForeverIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>
                                                    <QuestionTypeCellContent>
                                                        <QuestionTypeIconContainer>
                                                            <QuestionKindIconComponent />
                                                        </QuestionTypeIconContainer>
                                                        {
                                                            questionSpecicityMapping[question.kind]
                                                                .label
                                                        }
                                                    </QuestionTypeCellContent>
                                                </TableCell>
                                                <TableCell>
                                                    {question.title}
                                                    {!!question.possibleAnswers && (
                                                        <ul>
                                                            {question.possibleAnswers.map(
                                                                (possibleAnswer: string, index) => (
                                                                    <li
                                                                        key={`question-${question.id}-${index}`}
                                                                    >
                                                                        {possibleAnswer}
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {question.kind === 'qcm' &&
                                                    question.possibleAnswers ? (
                                                        question.possibleAnswers[
                                                            Number(question.rightAnswers[0])
                                                        ]
                                                    ) : (
                                                        <ul>
                                                            {question.rightAnswers.map(
                                                                (
                                                                    rightAnswer: string,
                                                                    index: number,
                                                                ) => (
                                                                    <li
                                                                        key={`question-right-answers-${question.id}-${index}`}
                                                                    >
                                                                        {rightAnswer}
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <ul>
                                                        {question.acceptableAnswers.map(
                                                            (
                                                                rightAnswer: string,
                                                                index: number,
                                                            ) => (
                                                                <li
                                                                    key={`question-acceptable-answers-${question.id}-${index}`}
                                                                >
                                                                    {rightAnswer}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
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

const QuestionTypeCellContent = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

const QuestionTypeIconContainer = styled('div')({
    marginRight: 8,
    display: 'flex',
    alignItems: 'center',
});
export { ExamTable };
