import { gradeType } from '../../../../types';

function computeIsUpdateAnswerButtonLoading(
    currentGrade: gradeType,
    isQuestionManuallyCorrected: boolean,
    loadingInfo: {
        removeOkAnswer: boolean;
        addAcceptableAnswer: gradeType | undefined;
        updateGrade: gradeType | undefined;
    },
) {
    if (isQuestionManuallyCorrected) {
        return currentGrade === loadingInfo.updateGrade;
    }
    if (currentGrade === 'E') {
        return loadingInfo.removeOkAnswer;
    }
    return currentGrade === loadingInfo.addAcceptableAnswer;
}

export { computeIsUpdateAnswerButtonLoading };
