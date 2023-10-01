import React, { useState } from 'react';
import { styled } from '@mui/material';
import { PhraseMelangeeAnswering } from './PhraseMelangeeAnswering';
import { QuestionChoixMultipleAnswering } from './QuestionChoixMultipleAnswering';
import { QuestionTrouAnswering } from './QuestionTrouAnswering';
import { phraseMelangeeType, questionChoixMultipleType, questionTrouType } from './types';

type qcmChoicesType = Record<number, number>;

function QuestionsAnswering(props: {
    attemptId: string;
    questionsChoixMultiple: Array<questionChoixMultipleType>;
    questionsTrou: Array<questionTrouType>;
    phrasesMelangees: Array<phraseMelangeeType>;
}) {
    const initialQcmChoices = props.questionsChoixMultiple.reduce((acc, questionChoixMultiple) => {
        return { ...acc, [questionChoixMultiple.id]: questionChoixMultiple.choice };
    }, {} as qcmChoicesType);

    const [qcmChoices, setQcmChoices] = useState<qcmChoicesType>(initialQcmChoices);

    return (
        <Container>
            {props.questionsChoixMultiple.map((questionChoixMultiple, index: number) => (
                <QuestionChoixMultipleAnswering
                    setChoice={buildSetChoice(questionChoixMultiple.id)}
                    choice={qcmChoices[questionChoixMultiple.id]}
                    key={questionChoixMultiple.id}
                    attemptId={props.attemptId}
                    index={index}
                    questionChoixMultiple={questionChoixMultiple}
                />
            ))}

            {props.questionsTrou.map((questionTrou, index: number) => (
                <QuestionTrouAnswering
                    key={questionTrou.id}
                    attemptId={props.attemptId}
                    index={index}
                    questionTrou={questionTrou}
                />
            ))}
            {props.phrasesMelangees.map((phraseMelangee, index: number) => (
                <PhraseMelangeeAnswering
                    key={phraseMelangee.id}
                    attemptId={props.attemptId}
                    index={index}
                    phraseMelangee={phraseMelangee}
                />
            ))}
        </Container>
    );

    function buildSetChoice(qcmId: number) {
        return (choice: number) => setQcmChoices({ ...qcmChoices, [qcmId]: choice });
    }
}

const Container = styled('div')({});

export { QuestionsAnswering };
