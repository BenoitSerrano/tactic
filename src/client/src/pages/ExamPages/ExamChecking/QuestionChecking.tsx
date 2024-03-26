import { answerStatusType, questionWithAnswersType } from '../types';
import { computeDisplayedAnswer } from '../lib/computeDisplayedAnswer';
import { TexteATrousChecking } from './TexteATrousChecking';
import { DefaultQuestionChecking } from './DefaultQuestionChecking';
import { attemptStatusType, questionKindType } from '../../../types';
import { ElementType } from 'react';
import { QcmQuestionChecking } from './QcmQuestionChecking';

const questionCheckingComponentMapping: Record<questionKindType, ElementType> = {
    phraseMelangee: DefaultQuestionChecking,
    qcm: QcmQuestionChecking,
    questionReponse: DefaultQuestionChecking,
    texteATrous: TexteATrousChecking,
    texteLibre: DefaultQuestionChecking,
};

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

    const QuestionCheckingComponent = questionCheckingComponentMapping[props.question.kind];
    return (
        <QuestionCheckingComponent
            shouldDisplayRightAnswers={props.shouldDisplayRightAnswers}
            attemptStatus={props.attemptStatus}
            question={props.question}
            attemptId={props.attemptId}
            answerStatus={props.answerStatus}
            examId={props.examId}
            canUpdateAnswers={props.canUpdateAnswers}
            index={props.index}
            displayedAnswer={displayedAnswer}
        />
    );
}

export { QuestionChecking };
