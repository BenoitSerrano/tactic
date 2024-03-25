import { answerStatusType, questionWithAnswersType } from '../types';
import { computeDisplayedAnswer } from '../lib/computeDisplayedAnswer';
import { TexteATrousChecking } from './TexteATrousChecking';
import { DefaultQuestionChecking } from './DefaultQuestionChecking';
import { attemptStatusType } from '../../../types';

function QuestionChecking(props: {
    attemptId: string;
    examId: string;
    question: questionWithAnswersType;
    index: number;
    answerStatus: answerStatusType;
    canUpdateAnswers: boolean;
    attemptStatus?: attemptStatusType;
    shouldDisplayRightAnswers?: boolean;
}) {
    const displayedAnswer = computeDisplayedAnswer(props.question, props.answerStatus);

    const QuestionCheckingComponent =
        props.question.kind === 'texteATrous' ? TexteATrousChecking : DefaultQuestionChecking;
    return (
        <QuestionCheckingComponent
            shouldDisplayRightAnswers={props.shouldDisplayRightAnswers}
            attemptStatus={props.attemptStatus}
            question={props.question}
            attemptId={props.attemptId}
            examId={props.examId}
            canUpdateAnswers={props.canUpdateAnswers}
            index={props.index}
            displayedAnswer={displayedAnswer}
        />
    );
}

export { QuestionChecking };
