import React, { useState } from 'react';
import { styled } from '@mui/material';
import { PhraseMelangeeAnswering } from './PhraseMelangeeAnswering';
import { QuestionChoixMultipleAnswering } from './QuestionChoixMultipleAnswering';
import { QuestionTrouAnswering } from './QuestionTrouAnswering';
import { phraseMelangeeType, questionChoixMultipleType, questionTrouType } from './types';

type qcmChoicesType = Record<number, number>;

type questionTrouAnswersType = Record<number, string>;

type phraseMelangeeAnswersType = Record<number, string>;

function QuestionsAnswering(props: {
    attemptId: string;
    questionsChoixMultiple: Array<questionChoixMultipleType>;
    questionsTrou: Array<questionTrouType>;
    phrasesMelangees: Array<phraseMelangeeType>;
}) {
    const initialQcmChoices = props.questionsChoixMultiple.reduce((acc, questionChoixMultiple) => {
        return { ...acc, [questionChoixMultiple.id]: questionChoixMultiple.choice };
    }, {} as qcmChoicesType);

    const initialQuestionTrouAnswers = props.questionsTrou.reduce((acc, questionTrou) => {
        return { ...acc, [questionTrou.id]: questionTrou.answer };
    }, {} as questionTrouAnswersType);

    const initialPhraseMelangeAnswers = props.phrasesMelangees.reduce((acc, phraseMelangee) => {
        return { ...acc, [phraseMelangee.id]: phraseMelangee.answer };
    }, {} as phraseMelangeeAnswersType);

    const [qcmChoices, setQcmChoices] = useState(initialQcmChoices);

    const [questionTrouAnswers, setQuestionTrouAnswers] = useState(initialQuestionTrouAnswers);

    const [phraseMelangeeAnswers, setPhraseMelangeeAnswers] = useState(initialPhraseMelangeAnswers);

    return (
        <Container>
            {props.questionsChoixMultiple.map((questionChoixMultiple, index: number) => (
                <QuestionChoixMultipleAnswering
                    setChoice={buildSetQcmChoice(questionChoixMultiple.id)}
                    choice={qcmChoices[questionChoixMultiple.id]}
                    key={questionChoixMultiple.id}
                    attemptId={props.attemptId}
                    index={index}
                    questionChoixMultiple={questionChoixMultiple}
                />
            ))}

            {props.questionsTrou.map((questionTrou, index: number) => (
                <QuestionTrouAnswering
                    setAnswer={buildSetQuestionTrouAnswer(questionTrou.id)}
                    answer={questionTrouAnswers[questionTrou.id]}
                    key={questionTrou.id}
                    attemptId={props.attemptId}
                    index={index}
                    questionTrou={questionTrou}
                />
            ))}
            {props.phrasesMelangees.map((phraseMelangee, index: number) => (
                <PhraseMelangeeAnswering
                    answer={phraseMelangeeAnswers[phraseMelangee.id]}
                    setAnswer={buildSetPhraseMelangeeAnswer(phraseMelangee.id)}
                    key={phraseMelangee.id}
                    attemptId={props.attemptId}
                    index={index}
                    phraseMelangee={phraseMelangee}
                />
            ))}
        </Container>
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
}

const Container = styled('div')({});

export { QuestionsAnswering };
