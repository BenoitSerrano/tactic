import { gradeType } from '../../../../types';

function computeIsTexteATrousUpdateAnswerButtonLoading(
    gradeToAttribute: gradeType,
    loadingInfo: {
        removeOkAnswer: boolean;
        addAcceptableAnswer: gradeType | undefined;
    },
) {
    if (gradeToAttribute === 'E') {
        return loadingInfo.removeOkAnswer;
    }
    return gradeToAttribute === loadingInfo.addAcceptableAnswer;
}

export { computeIsTexteATrousUpdateAnswerButtonLoading };
