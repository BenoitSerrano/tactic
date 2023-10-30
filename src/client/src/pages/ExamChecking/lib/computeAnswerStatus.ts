import { answerStatusType } from '../types';

function computeAnswerStatus(mark: number, points: number): answerStatusType {
    if (!mark) {
        return 'wrong';
    }
    if (mark === points) {
        return 'right';
    }
    return 'acceptable';
}

export { computeAnswerStatus };
