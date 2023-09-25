import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    styled,
} from '@mui/material';
import { api } from '../../lib/api';
import {
    PhraseMelangeeUpsertionModal,
    phraseMelangeeModalStatusType,
    phraseMelangeeType,
} from './PhraseMelangeeUpsertionModal';
import { Menu } from '../../components/Menu';
import {
    QuestionChoixMultipleUpsertionModal,
    questionChoixMultipleModalStatusType,
    questionChoixMultipleType,
} from './QuestionChoixMultipleUpsertionModal';
import {
    QuestionTrouUpsertionModal,
    questionTrouModalStatusType,
    questionTrouType,
} from './QuestionTrouUpsertionModal';

function ExamEdition() {
    const params = useParams<{ examId: string }>();
    const examId = params.examId as string;
    const query = useQuery(['exams', examId], () => api.fetchExam(examId));

    const [currentPhraseMelangeeModalStatus, setCurrentPhraseMelangeeModalStatus] = useState<
        phraseMelangeeModalStatusType | undefined
    >();
    const [currentQCMModalStatus, setCurrentQCMModalStatus] = useState<
        questionChoixMultipleModalStatusType | undefined
    >();
    const [currentQuestionTrouModalStatus, setCurrentQuestionTrouModalStatus] = useState<
        questionTrouModalStatusType | undefined
    >();

    const menuButtons = [
        {
            title: 'Créer un QCM',
            onClick: () => setCurrentQCMModalStatus({ kind: 'creating' }),
            IconComponent: RadioButtonCheckedIcon,
        },
        {
            title: 'Créer un texte à trou',
            onClick: () => setCurrentQuestionTrouModalStatus({ kind: 'creating' }),
            IconComponent: SaveAltIcon,
        },
        {
            title: 'Créer une phrase à reconstituer',
            onClick: () => setCurrentPhraseMelangeeModalStatus({ kind: 'creating' }),
            IconComponent: LowPriorityIcon,
        },
    ];

    return (
        <>
            <Menu buttons={menuButtons} />
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Actions</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Intitulé</TableCell>
                        <TableCell>Bonne(s) réponse(s)</TableCell>
                        <TableCell>Réponse(s) acceptée(s)</TableCell>
                        <TableCell>Points</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {query.data?.questionsChoixMultiple.map(
                        (questionChoixMultiple: questionChoixMultipleType) => (
                            <TableRow key={`questionChoixMultiple-${questionChoixMultiple.id}`}>
                                <TableCell>
                                    <IconButton
                                        onClick={buildEditQuestionChoixMultipleOnClick(
                                            questionChoixMultiple,
                                        )}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <QuestionTypeCellContent>
                                        <QuestionTypeIconContainer>
                                            <RadioButtonCheckedIcon />
                                        </QuestionTypeIconContainer>
                                        QCM
                                    </QuestionTypeCellContent>
                                </TableCell>
                                <TableCell>
                                    {questionChoixMultiple.title}
                                    <br />
                                    <ul>
                                        {questionChoixMultiple.possibleAnswers.map(
                                            (possibleAnswer: string, index) => (
                                                <li
                                                    key={`questionChoixMultiple-${questionChoixMultiple.id}-${index}`}
                                                >
                                                    {possibleAnswer}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </TableCell>
                                <TableCell>
                                    {
                                        questionChoixMultiple.possibleAnswers[
                                            questionChoixMultiple.rightAnswerIndex
                                        ]
                                    }
                                </TableCell>
                                <TableCell />
                                <TableCell>{questionChoixMultiple.points}</TableCell>
                            </TableRow>
                        ),
                    )}
                    {query.data?.questionsTrou.map((questionTrou: questionTrouType) => (
                        <TableRow>
                            <TableCell>
                                <IconButton onClick={buildEditQuestionTrouOnClick(questionTrou)}>
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell>
                                {' '}
                                <QuestionTypeCellContent>
                                    <QuestionTypeIconContainer>
                                        <SaveAltIcon />
                                    </QuestionTypeIconContainer>
                                    Texte à trou
                                </QuestionTypeCellContent>
                            </TableCell>
                            <TableCell>
                                {questionTrou.beforeText} ....... {questionTrou.afterText}
                            </TableCell>
                            <TableCell>
                                <ul>
                                    {questionTrou.rightAnswers.map((rightAnswer: string) => (
                                        <li
                                            key={`questionTrou-${questionTrou.id}-rightAnswer-${rightAnswer}`}
                                        >
                                            {rightAnswer}
                                        </li>
                                    ))}
                                </ul>
                            </TableCell>
                            <TableCell>
                                <ul>
                                    {questionTrou.acceptableAnswers.map(
                                        (acceptableAnswer: string) => (
                                            <li
                                                key={`questionTrou-${questionTrou.id}-acceptableAnswer-${acceptableAnswer}`}
                                            >
                                                {acceptableAnswer}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </TableCell>
                            <TableCell>{questionTrou.points}</TableCell>
                        </TableRow>
                    ))}
                    {query.data?.phrasesMelangees.map((phraseMelangee: phraseMelangeeType) => (
                        <TableRow key={`phraseMelangee-${phraseMelangee.id}`}>
                            <TableCell>
                                <IconButton
                                    onClick={buildEditPhraseMelangeeOnClick(phraseMelangee)}
                                >
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell>
                                <QuestionTypeCellContent>
                                    <QuestionTypeIconContainer>
                                        <LowPriorityIcon />
                                    </QuestionTypeIconContainer>
                                    Phrase mélangée
                                </QuestionTypeCellContent>
                            </TableCell>
                            <TableCell>{phraseMelangee.shuffledPhrase}</TableCell>
                            <TableCell>
                                <ul>
                                    {phraseMelangee.correctPhrases.map((correctPhrase: string) => (
                                        <li>{correctPhrase}</li>
                                    ))}
                                </ul>
                            </TableCell>
                            <TableCell />
                            <TableCell>{phraseMelangee.points}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {!!currentPhraseMelangeeModalStatus && (
                <PhraseMelangeeUpsertionModal
                    examId={examId}
                    modalStatus={currentPhraseMelangeeModalStatus}
                    close={() => setCurrentPhraseMelangeeModalStatus(undefined)}
                />
            )}
            {!!currentQCMModalStatus && (
                <QuestionChoixMultipleUpsertionModal
                    examId={examId}
                    modalStatus={currentQCMModalStatus}
                    close={() => setCurrentQCMModalStatus(undefined)}
                />
            )}
            {!!currentQuestionTrouModalStatus && (
                <QuestionTrouUpsertionModal
                    examId={examId}
                    modalStatus={currentQuestionTrouModalStatus}
                    close={() => setCurrentQuestionTrouModalStatus(undefined)}
                />
            )}
        </>
    );

    function buildEditPhraseMelangeeOnClick(phraseMelangee: phraseMelangeeType) {
        return () => {
            setCurrentPhraseMelangeeModalStatus({ kind: 'editing', question: phraseMelangee });
        };
    }

    function buildEditQuestionTrouOnClick(questionTrou: questionTrouType) {
        return () => {
            setCurrentQuestionTrouModalStatus({ kind: 'editing', question: questionTrou });
        };
    }

    function buildEditQuestionChoixMultipleOnClick(
        questionChoixMultiple: questionChoixMultipleType,
    ) {
        return () => {
            setCurrentQCMModalStatus({ kind: 'editing', question: questionChoixMultiple });
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
