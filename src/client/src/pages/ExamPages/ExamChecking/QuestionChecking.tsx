import { answerStatusType, questionWithAnswersType } from '../types';
import { computeDisplayedAnswer } from '../lib/computeDisplayedAnswer';
import { TexteATrousChecking } from './TexteATrousChecking';
import { DefaultQuestionChecking } from './DefaultQuestionChecking';

function QuestionChecking(props: {
    attemptId: string;
    examId: string;
    question: questionWithAnswersType;
    index: number;
    answerStatus: answerStatusType;
    canUpdateAnswers: boolean;
}) {
    const displayedAnswer = computeDisplayedAnswer(props.question, props.answerStatus);

    const QuestionCheckingComponent =
        props.question.kind === 'texteATrous' ? TexteATrousChecking : DefaultQuestionChecking;
    return (
        <QuestionCheckingComponent
            questionId={props.question.id}
            attemptId={props.attemptId}
            examId={props.examId}
            canUpdateAnswers={props.canUpdateAnswers}
            index={props.index}
            displayedAnswer={displayedAnswer}
        />
    );
}

export { QuestionChecking };
