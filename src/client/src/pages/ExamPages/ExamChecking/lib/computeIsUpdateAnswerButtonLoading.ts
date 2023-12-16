function computeIsUpdateAnswerButtonLoading(
    currentMultiplier: number,
    isQuestionManuallyCorrected: boolean,
    loadingInfo: {
        removeOkAnswer: boolean;
        addAcceptableAnswer: number | undefined;
        saveMark: number | undefined;
    },
) {
    if (isQuestionManuallyCorrected) {
        return currentMultiplier === loadingInfo.saveMark;
    }
    if (currentMultiplier === 0) {
        return loadingInfo.removeOkAnswer;
    }
    return currentMultiplier === loadingInfo.addAcceptableAnswer;
}

export { computeIsUpdateAnswerButtonLoading };
