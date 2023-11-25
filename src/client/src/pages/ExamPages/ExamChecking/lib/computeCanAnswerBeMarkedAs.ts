import { answerStatusType, questionWithAnswersType } from '../../types';

function computeCanAnswerBeMarkedAs(
    newStatus: answerStatusType,
    currentAnswerStatus: answerStatusType,
    question: questionWithAnswersType,
) {
    switch (newStatus) {
        case 'right':
            return currentAnswerStatus !== 'right' && !!question.answer;
        case 'acceptable':
            return (
                currentAnswerStatus !== 'acceptable' &&
                !!question.answer &&
                (currentAnswerStatus !== 'right' || question.rightAnswers.length > 1)
            );
        case 'wrong':
            return (
                currentAnswerStatus !== 'wrong' &&
                (currentAnswerStatus !== 'right' || question.rightAnswers.length > 1)
            );
        case undefined:
            return false;
    }
}

export { computeCanAnswerBeMarkedAs };
