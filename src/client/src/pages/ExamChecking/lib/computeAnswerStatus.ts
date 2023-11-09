import { answerStatusType } from '../types';

function computeAnswerStatus(mark: number | undefined, points: number): answerStatusType {
    if (mark === undefined) {
        return undefined;
    }
    if (!mark) {
        return 'wrong';
    }
    if (mark === points) {
        return 'right';
    }
    return 'acceptable';
}

export { computeAnswerStatus };
