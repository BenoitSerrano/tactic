import React, { useState } from 'react';
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
import { questionKindType } from '../../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { questionKindIconComponentMapping } from './constants';
import { tableHandler } from '../../lib/tableHandler';

const questionKindTitleMapping: Record<questionKindType, string> = {
    qcm: 'QCM',
    questionTrou: 'Texte à trou',
    phraseMelangee: 'Phrase à reconstituer',
};

function ExamsTable(props: {
    examId: string;
    questions: Array<questionWithAnswersType>;
    openEditionModal: (question: questionWithAnswersType) => void;
}) {
    const queryClient = useQueryClient();
    const deleteQuestionMutation = useMutation({
        mutationFn: api.deleteQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });
    const [questions, setQuestions] = useState(props.questions);
    const totalPoints = props.questions.reduce(
        (sum: number, question: { points: number }) => sum + question.points,
        0,
    );

    const handleDragEnd: OnDragEndResponder = (result) => {
        if (!result.destination) {
            return;
        }
        const newQuestions = tableHandler.swap(
            questions,
            result.source.index,
            result.destination.index,
        );
        setQuestions(newQuestions);
    };
    return (
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell width={20}>N°</TableCell>
                    <TableCell width={100}>Actions</TableCell>
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
                                    questionKindIconComponentMapping[question.kind];
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
                                                {...provided.dragHandleProps}
                                            >
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
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
                                                        {questionKindTitleMapping[question.kind]}
                                                    </QuestionTypeCellContent>
                                                </TableCell>
                                                <TableCell>
                                                    {question.title}
                                                    <ul>
                                                        {question.possibleAnswers?.map(
                                                            (possibleAnswer: string, index) => (
                                                                <li
                                                                    key={`question-${question.id}-${index}`}
                                                                >
                                                                    {possibleAnswer}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
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
export { ExamsTable };
