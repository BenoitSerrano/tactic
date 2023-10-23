import { questionWithoutAnswer } from './types';
import { questionSpecicityMapping } from './constants';

function QuestionAnswering(props: {
    question: questionWithoutAnswer;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}): JSX.Element {
    const { QuestionAnsweringComponent } = questionSpecicityMapping[props.question.kind];

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
