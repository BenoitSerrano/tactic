import React from 'react';
import { questionType } from './types';
import { QuestionChoixMultipleAnswering } from './QuestionChoixMultipleAnswering';
import { QuestionTrouAnswering } from './QuestionTrouAnswering';
import { PhraseMelangeeAnswering } from './PhraseMelangeeAnswering';

function QuestionAnswering(props: {
    question: questionType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    switch (props.question.kind) {
        case 'qcm':
            return (
                <QuestionChoixMultipleAnswering
                    setCurrentAnswer={props.setCurrentAnswer}
                    currentAnswer={props.currentAnswer}
                    index={props.index}
                    question={props.question}
                />
            );
        case 'questionTrou':
            return (
                <QuestionTrouAnswering
                    setCurrentAnswer={props.setCurrentAnswer}
                    currentAnswer={props.currentAnswer}
                    index={props.index}
                    question={props.question}
                />
            );
        case 'phraseMelangee':
            return (
                <PhraseMelangeeAnswering
                    currentAnswer={props.currentAnswer}
                    setCurrentAnswer={props.setCurrentAnswer}
                    index={props.index}
                    question={props.question}
                />
            );
        default:
            return <div />;
    }
}

export { QuestionAnswering };
