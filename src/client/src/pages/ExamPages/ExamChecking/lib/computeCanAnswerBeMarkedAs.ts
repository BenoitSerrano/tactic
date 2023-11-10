import { answerStatusType, questionType } from '../../types';

function computeCanAnswerBeMarkedAs(
    newStatus: answerStatusType,
    currentAnswerStatus: answerStatusType,
    question: questionType,
) {
    switch (newStatus) {
        case 'right':
            return currentAnswerStatus !== 'right';
        case 'acceptable':
            return (
                currentAnswerStatus !== 'acceptable' &&
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
