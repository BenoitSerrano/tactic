import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { QuestionChoixMultipleEdition } from './QuestionChoixMultipleEdition';
import { QuestionTrouEdition } from './QuestionTrouEdition';
import { Button, styled } from '@mui/material';
import { authentication } from '../../lib/authentication';
import { PhraseMelangeeEdition } from './PhraseMelangeeEdition';

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

    return (
        <MainContainer>
            <HeaderContainer>
                <Button onClick={navigateToExamList}>Revenir à la liste des examens</Button>
            </HeaderContainer>
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
            {query.data?.phrasesMelangees.map((phrasesMelangee: any) => (
                <PhraseMelangeeEdition
                    key={`${examId}-${phrasesMelangee.id}`}
                    examId={examId}
                    phraseMelangee={phrasesMelangee}
                />
            ))}
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
            </FooterContainer>
        </MainContainer>
    );

    function addNewQuestionChoixMultiple() {
        createQcmMutation.mutate(params.examId as string);
    }

    function addNewQuestionTrou() {
        createQuestionTrouMutation.mutate(params.examId as string);
    }

    function addNewPhraseMelangee() {
        createPhraseMelangeeMutation.mutate(params.examId as string);
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
