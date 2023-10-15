import React, { ElementType, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
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
import { api } from '../../lib/api';
import { Menu } from '../../components/Menu';
import { Loader } from '../../components/Loader';
import { questionKindType } from '../../types';
import { modalStatusType } from './utils';
import { QuestionUpsertionModal } from './QuestionUpsertionModal';
import { questionWithAnswersType } from './types';

const questionKindIconComponentMapping: Record<questionKindType, ElementType> = {
    qcm: RadioButtonCheckedIcon,
    questionTrou: SaveAltIcon,
    phraseMelangee: LowPriorityIcon,
};

const questionKindTitleMapping: Record<questionKindType, string> = {
    qcm: 'QCM',
    questionTrou: 'Texte à trou',
    phraseMelangee: 'Phrase à reconstituer',
};

function ExamEdition() {
    const params = useParams<{ examId: string }>();
    const examId = params.examId as string;
    const queryClient = useQueryClient();
    const query = useQuery<{ questions: Array<questionWithAnswersType> }>(['exams', examId], () =>
        api.fetchExam(examId),
    );
    const deleteQuestionMutation = useMutation({
        mutationFn: api.deleteQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', examId] });
        },
    });

    const [currentQuestionModalStatus, setCurrentQuestionModalStatus] = useState<
        modalStatusType | undefined
    >();

    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    const menuButtons = [
        {
            title: 'Ajouter une nouvelle QCM',
            onClick: () => setCurrentQuestionModalStatus({ kind: 'creating', questionKind: 'qcm' }),
            IconComponent: questionKindIconComponentMapping['qcm'],
        },
        {
            title: 'Ajouter une nouvelle question à trou',
            onClick: () =>
                setCurrentQuestionModalStatus({ kind: 'creating', questionKind: 'questionTrou' }),
            IconComponent: questionKindIconComponentMapping['questionTrou'],
        },
        {
            title: 'Ajouter une nouvelle phrase mélangée',
            onClick: () =>
                setCurrentQuestionModalStatus({ kind: 'creating', questionKind: 'phraseMelangee' }),
            IconComponent: questionKindIconComponentMapping['phraseMelangee'],
        },
    ];

    const totalPoints = query.data.questions.reduce(
        (sum: number, question: { points: number }) => sum + question.points,
        0,
    );
    return (
        <>
            <Menu buttons={menuButtons} />
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell width={20}>N°</TableCell>
                        <TableCell width={30}>Actions</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Intitulé</TableCell>
                        <TableCell>Bonne(s) réponse(s)</TableCell>
                        <TableCell>Réponse(s) acceptée(s)</TableCell>
                        <TableCell>Points</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {query.data.questions.map((question, index) => {
                        const QuestionKindIconComponent =
                            questionKindIconComponentMapping[question.kind];
                        return (
                            <TableRow key={`question-${question.id}`}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <IconButton onClick={buildEditQuestionOnClick(question)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={buildDeleteQuestionOnClick(question)}>
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
                                                <li key={`question-${question.id}-${index}`}>
                                                    {possibleAnswer}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </TableCell>
                                <TableCell>
                                    {question.kind === 'qcm' && question.possibleAnswers ? (
                                        question.possibleAnswers[Number(question.rightAnswers[0])]
                                    ) : (
                                        <ul>
                                            {question.rightAnswers.map(
                                                (rightAnswer: string, index: number) => (
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
                                            (rightAnswer: string, index: number) => (
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
                        );
                    })}
                </TableBody>
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
            {!!currentQuestionModalStatus && (
                <QuestionUpsertionModal
                    examId={examId}
                    modalStatus={currentQuestionModalStatus}
                    close={() => setCurrentQuestionModalStatus(undefined)}
                />
            )}
        </>
    );

    function buildEditQuestionOnClick(question: questionWithAnswersType) {
        return () => {
            setCurrentQuestionModalStatus({ kind: 'editing', question });
        };
    }

    function buildDeleteQuestionOnClick(question: questionWithAnswersType) {
        return () => {
            // eslint-disable-next-line no-restricted-globals
            const hasConfirmed = confirm(
                'Souhaitez-vous réellement supprimer cette question ? Toutes les réponses associées à cette question seront également supprimées.',
            );
            if (hasConfirmed) {
                deleteQuestionMutation.mutate({ examId, questionId: question.id });
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

export { ExamEdition };
