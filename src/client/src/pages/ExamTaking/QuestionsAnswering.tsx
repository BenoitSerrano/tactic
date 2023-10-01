import React from 'react';
import { styled } from '@mui/material';
import { PhraseMelangeeAnswering } from './PhraseMelangeeAnswering';
import { QuestionChoixMultipleAnswering } from './QuestionChoixMultipleAnswering';
import { QuestionTrouAnswering } from './QuestionTrouAnswering';
import { phraseMelangeeType, questionChoixMultipleType, questionTrouType } from './types';

function QuestionsAnswering(props: {
    attemptId: string;
    questionsChoixMultiple: Array<questionChoixMultipleType>;
    questionsTrou: Array<questionTrouType>;
    phrasesMelangees: Array<phraseMelangeeType>;
}) {
    return (
        <Container>
            {props.questionsChoixMultiple.map((questionChoixMultiple, index: number) => (
                <QuestionChoixMultipleAnswering
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
}

const Container = styled('div')({});

export { QuestionsAnswering };
