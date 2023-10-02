import React, { useState } from 'react';
import { styled } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { PhraseMelangeeAnswering } from './PhraseMelangeeAnswering';
import { QuestionChoixMultipleAnswering } from './QuestionChoixMultipleAnswering';
import { QuestionTrouAnswering } from './QuestionTrouAnswering';
import { phraseMelangeeType, questionChoixMultipleType, questionTrouType } from './types';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';

type qcmChoicesType = Record<number, number>;

type questionTrouAnswersType = Record<number, string>;

type phraseMelangeeAnswersType = Record<number, string>;

function QuestionsAnswering(props: {
    attemptId: string;
    questionsChoixMultiple: Array<questionChoixMultipleType>;
    questionsTrou: Array<questionTrouType>;
    phrasesMelangees: Array<phraseMelangeeType>;
    onExamDone: () => void;
}) {
    const saveDraftMutation = useMutation({
        mutationFn: api.updateAttempt,
        onSuccess: () => {
            displayAlert({ variant: 'success', text: 'Vos réponses ont bien été sauvegardées.' });
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const finishExamMutation = useMutation({
        mutationFn: api.updateAttempt,
        onSuccess: () => {
            props.onExamDone();
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const { displayAlert } = useAlert();

    const initialQcmChoices = props.questionsChoixMultiple.reduce((acc, questionChoixMultiple) => {
        return { ...acc, [questionChoixMultiple.id]: questionChoixMultiple.choice };
    }, {} as qcmChoicesType);

    const initialQuestionTrouAnswers = props.questionsTrou.reduce((acc, questionTrou) => {
        return { ...acc, [questionTrou.id]: questionTrou.answer || '' };
    }, {} as questionTrouAnswersType);

    const initialPhraseMelangeAnswers = props.phrasesMelangees.reduce((acc, phraseMelangee) => {
        return { ...acc, [phraseMelangee.id]: phraseMelangee.answer || '' };
    }, {} as phraseMelangeeAnswersType);

    const [qcmChoices, setQcmChoices] = useState(initialQcmChoices);

    const [questionTrouAnswers, setQuestionTrouAnswers] = useState(initialQuestionTrouAnswers);

    const [phraseMelangeeAnswers, setPhraseMelangeeAnswers] = useState(initialPhraseMelangeAnswers);

    let index = 0;

    return (
        <>
            <Container>
                {props.questionsChoixMultiple.map((questionChoixMultiple) => {
                    index++;
                    return (
                        <QuestionContainer key={'qcm-' + questionChoixMultiple.id}>
                            <QuestionChoixMultipleAnswering
                                setChoice={buildSetQcmChoice(questionChoixMultiple.id)}
                                choice={qcmChoices[questionChoixMultiple.id]}
                                attemptId={props.attemptId}
                                index={index}
                                questionChoixMultiple={questionChoixMultiple}
                            />
                        </QuestionContainer>
                    );
                })}
                {props.questionsTrou.map((questionTrou) => {
                    index++;
                    return (
                        <QuestionContainer key={'questionTrou-' + questionTrou.id}>
                            <QuestionTrouAnswering
                                setAnswer={buildSetQuestionTrouAnswer(questionTrou.id)}
                                answer={questionTrouAnswers[questionTrou.id]}
                                attemptId={props.attemptId}
                                index={index}
                                questionTrou={questionTrou}
                            />
                        </QuestionContainer>
                    );
                })}
                {props.phrasesMelangees.map((phraseMelangee) => {
                    index++;
                    return (
                        <QuestionContainer key={'phraseMelangee-' + phraseMelangee.id}>
                            <PhraseMelangeeAnswering
                                answer={phraseMelangeeAnswers[phraseMelangee.id]}
                                setAnswer={buildSetPhraseMelangeeAnswer(phraseMelangee.id)}
                                attemptId={props.attemptId}
                                index={index}
                                phraseMelangee={phraseMelangee}
                            />
                        </QuestionContainer>
                    );
                })}
            </Container>
            <ButtonContainer>
                <LoadingButton loading={saveDraftMutation.isLoading} onClick={saveDraft}>
                    Enregistrer le brouillon
                </LoadingButton>
                <LoadingButton
                    loading={finishExamMutation.isLoading}
                    variant="contained"
                    onClick={finishExam}
                >
                    Valider les réponses
                </LoadingButton>
            </ButtonContainer>
        </>
    );

    function buildSetQcmChoice(qcmId: number) {
        return (choice: number) => setQcmChoices({ ...qcmChoices, [qcmId]: choice });
    }

    function buildSetQuestionTrouAnswer(questionTrouId: number) {
        return (answer: string) =>
            setQuestionTrouAnswers({ ...questionTrouAnswers, [questionTrouId]: answer });
    }

    function buildSetPhraseMelangeeAnswer(phraseMelangeeId: number) {
        return (answer: string) =>
            setPhraseMelangeeAnswers({ ...phraseMelangeeAnswers, [phraseMelangeeId]: answer });
    }

    function saveDraft() {
        saveDraftMutation.mutate({
            attemptId: props.attemptId,
            qcmChoices,
            questionTrouAnswers,
            phraseMelangeeAnswers,
        });
    }

    function finishExam() {
        finishExamMutation.mutate({
            attemptId: props.attemptId,
            qcmChoices,
            questionTrouAnswers,
            phraseMelangeeAnswers,
        });
    }
}

const BUTTON_CONTAINER_HEIGHT = 50;

const Container = styled('div')({
    marginBottom: BUTTON_CONTAINER_HEIGHT,
    width: '100%',
});
const ButtonContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: BUTTON_CONTAINER_HEIGHT,
    backgroundColor: 'white',
    position: 'fixed',
    width: '100%',
    bottom: 0,
});

const QuestionContainer = styled('div')({ marginTop: 30, marginBottom: 30 });

export { QuestionsAnswering };
