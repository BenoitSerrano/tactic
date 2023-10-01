import { styled } from '@mui/material';
import React from 'react';
import { PhraseMelangeeAnswering } from './PhraseMelangeeAnswering';
import { QuestionChoixMultipleAnswering } from './QuestionChoixMultipleAnswering';
import { QuestionTrouAnswering } from './QuestionTrouAnswering';

function QuestionsAnswering(props: {
    attemptId: string;
    questionsChoixMultiple: any;
    questionsTrou: any;
    phrasesMelangees: any;
}) {
    return (
        <Container>
            {props.questionsChoixMultiple.map((questionChoixMultiple: any, index: number) => (
                <QuestionChoixMultipleAnswering
                    key={questionChoixMultiple.id}
                    attemptId={props.attemptId}
                    index={index}
                    questionChoixMultiple={questionChoixMultiple}
                />
            ))}

            {props.questionsTrou.map((questionTrou: any, index: number) => (
                <QuestionTrouAnswering
                    key={questionTrou.id}
                    attemptId={props.attemptId}
                    index={index}
                    questionTrou={questionTrou}
                />
            ))}
            {props.phrasesMelangees.map((phraseMelangee: any, index: number) => (
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
