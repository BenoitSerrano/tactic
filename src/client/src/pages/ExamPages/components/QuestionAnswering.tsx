import { questionWithoutAnswerType } from '../types';
import { QuestionChoixMultipleAnswering } from './QuestionChoixMultipleAnswering';
import { QuestionReponseAnswering } from './QuestionReponseAnswering';
import { PhraseMelangeeAnswering } from './PhraseMelangeeAnswering';
import { TexteLibreAnswering } from './TexteLibreAnswering';
import { TexteATrousAnswering } from './TexteATrousAnswering';
import { questionKindType } from '../../../types';
import { ElementType } from 'react';

const questionAnsweringComponentMapping: Record<questionKindType, ElementType> = {
    qcm: QuestionChoixMultipleAnswering,
    questionReponse: QuestionReponseAnswering,
    phraseMelangee: PhraseMelangeeAnswering,
    texteLibre: TexteLibreAnswering,
    texteATrous: TexteATrousAnswering,
};

function QuestionAnswering(props: {
    question: questionWithoutAnswerType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}): JSX.Element {
    const QuestionAnsweringComponent = questionAnsweringComponentMapping[props.question.kind];

    return (
        <QuestionAnsweringComponent
            setCurrentAnswer={props.setCurrentAnswer}
            currentAnswer={props.currentAnswer}
            index={props.index}
            question={props.question}
        />
    );
}

export { QuestionAnswering };
