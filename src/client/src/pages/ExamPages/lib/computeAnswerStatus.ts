import { answerStatusType, questionWithAnswersType } from '../types';

function computeAnswerStatus(question: questionWithAnswersType): answerStatusType {
    if (question.kind === 'texteATrous' || question.kind === 'texteLibre') {
        if (question.mark === question.points) {
            return 'right';
        } else if (question.mark !== undefined && question.mark > 0) {
            return 'acceptable';
        } else {
            return 'wrong';
        }
    }

    if (question.grade === 'E') {
        return 'wrong';
    }
    if (question.grade === 'A') {
        return 'right';
    }
    return 'acceptable';
}

export { computeAnswerStatus };
