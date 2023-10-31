import { marksType } from './computeMarks';

function computeHasEditedMarks(initialMarks: marksType, currentMarks: marksType) {
    for (const questionId of Object.keys(initialMarks)) {
        if (initialMarks[Number(questionId)] !== currentMarks[Number(questionId)]) {
            return true;
        }
    }

    for (const questionId of Object.keys(currentMarks)) {
        if (currentMarks[Number(questionId)] !== initialMarks[Number(questionId)]) {
            return true;
        }
    }
    return false;
}

export { computeHasEditedMarks };
