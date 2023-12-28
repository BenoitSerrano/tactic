import { gradeType } from '../../../types';
import { answerStatusType } from '../types';

function computeAnswerStatus(grade: gradeType | undefined): answerStatusType {
    if (grade === undefined) {
        return undefined;
    }
    if (grade === 'E') {
        return 'wrong';
    }
    if (grade === 'A') {
        return 'right';
    }
    return 'acceptable';
}

export { computeAnswerStatus };
