import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import {
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    styled,
} from '@mui/material';
import { api } from '../../lib/api';
import { QuestionChoixMultipleEdition } from './QuestionChoixMultipleEdition';
import { QuestionTrouEdition } from './QuestionTrouEdition';
import { authentication } from '../../lib/authentication';
import {
    PhraseMelangeeUpsertionModal,
    phraseMelangeeModalStatusType,
    phraseMelangeeType,
} from './PhraseMelangeeUpsertionModal';
import { Menu } from '../../components/Menu';

const HEADER_SIZE = 50;
const FOOTER_SIZE = 50;

function ExamEdition() {
    const params = useParams<{ examId: string }>();
    const examId = params.examId as string;
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const query = useQuery(['exams', examId], () => api.fetchExam(examId));
    const createQcmMutation = useMutation({
        mutationFn: api.createQuestionChoixMultiple,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', examId] });
        },
    });
    const createQuestionTrouMutation = useMutation({
        mutationFn: api.createQuestionTrou,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', examId] });
        },
    });

    const createPhraseMelangeeMutation = useMutation({
        mutationFn: api.createPhraseMelangee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', examId] });
        },
    });

    const [currentPhraseMelangeeModalStatus, setCurrentPhraseMelangeeModalStatus] = useState<
        phraseMelangeeModalStatusType | undefined
    >();

    return (
        <MainContainer>
            <HeaderContainer>
                <Button onClick={navigateToExamList}>Revenir à la liste des examens</Button>
            </HeaderContainer>
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
                    {query.data?.questionsChoixMultiple.map((questionChoixMultiple: any) => (
                        <TableRow key={`questionChoixMultiple-${questionChoixMultiple.id}`}>
                            <TableCell>QCM</TableCell>
                            <TableCell>
                                {questionChoixMultiple.title}
                                <br />
                                <ul>
                                    {questionChoixMultiple.possibleAnswers.map(
                                        (possibleAnswer: string) => (
                                            <li
                                                key={`questionChoixMultiple-${questionChoixMultiple}-${possibleAnswer}`}
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
                            <TableCell>Phrase mélangée</TableCell>
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
                    {query.data?.questionsTrou.map((questionTrou: any) => (
                        <TableRow>
                            <TableCell>Texte à trou</TableCell>
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
                </TableBody>
            </Table>
            {!!currentPhraseMelangeeModalStatus && (
                <PhraseMelangeeUpsertionModal
                    examId={examId}
                    modalStatus={currentPhraseMelangeeModalStatus}
                    close={() => setCurrentPhraseMelangeeModalStatus(undefined)}
                />
            )}
            {query.data?.questionsChoixMultiple.map((questionChoixMultiple: any) => (
                <QuestionChoixMultipleEdition
                    key={`${examId}-${questionChoixMultiple.id}`}
                    examId={examId}
                    questionChoixMultiple={questionChoixMultiple}
                />
            ))}
            {query.data?.questionsTrou.map((questionTrou: any) => (
                <QuestionTrouEdition
                    key={`${examId}-${questionTrou.id}`}
                    examId={examId}
                    questionTrou={questionTrou}
                />
            ))}
            <Menu
                buttons={[
                    {
                        title: 'Créer une phrase à reconstituer',
                        onClick: () => setCurrentPhraseMelangeeModalStatus({ kind: 'creating' }),
                        IconComponent: LowPriorityIcon,
                    },
                ]}
            />
            {/* {query.data?.phrasesMelangees.map((phrasesMelangee: any) => (
                <PhraseMelangeeEdition
                    key={`${examId}-${phrasesMelangee.id}`}
                    examId={examId}
                    phraseMelangee={phrasesMelangee}
                />
            ))} */}
            {/* 
            <FooterContainer>
                <Button variant="contained" onClick={addNewQuestionChoixMultiple}>
                    Ajouter une nouvelle question à choix multiple
                </Button>
                <Button variant="contained" onClick={addNewQuestionTrou}>
                    Ajouter une nouvelle question à trou
                </Button>
                <Button variant="contained" onClick={addNewPhraseMelangee}>
                    Ajouter une nouvelle phrase mélangée
                </Button>
            </FooterContainer> */}
        </MainContainer>
    );

    function buildEditPhraseMelangeeOnClick(phraseMelangee: phraseMelangeeType) {
        return () => {
            setCurrentPhraseMelangeeModalStatus({ kind: 'editing', phraseMelangee });
        };
    }

    function addNewQuestionChoixMultiple() {
        createQcmMutation.mutate(params.examId as string);
    }

    function addNewQuestionTrou() {
        createQuestionTrouMutation.mutate(params.examId as string);
    }

    function navigateToExamList() {
        navigate(`/teacher/${authentication.getEncodedPassword()}/exams`);
    }
}

const FooterContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'fixed',
    zIndex: 10,
    bottom: 0,
    flex: 1,
    width: '100%',
    height: `${FOOTER_SIZE}px`,
    backgroundColor: 'white',
});

const HeaderContainer = styled('div')({
    width: '100%',
    top: 0,
    position: 'fixed',
    zIndex: 10,
    backgroundColor: 'white',

    height: `${HEADER_SIZE}px`,
});

const MainContainer = styled('div')({
    paddingTop: `${HEADER_SIZE + 10}px`,
    paddingBottom: `${FOOTER_SIZE}px`,
});

export { ExamEdition };
