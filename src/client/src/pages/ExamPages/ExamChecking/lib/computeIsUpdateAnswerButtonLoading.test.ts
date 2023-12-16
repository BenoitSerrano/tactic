import { computeIsUpdateAnswerButtonLoading } from './computeIsUpdateAnswerButtonLoading';

describe('computeIsUpdateAnswerButtonLoading', () => {
    it('should return true if remove ok answer', () => {
        const currentMultiplier = 0;
        const isQuestionManuallyCorrected = false;
        const loadingInfo = {
            removeOkAnswer: true,
            addAcceptableAnswer: undefined,
            saveMark: undefined,
        };

        const isUpdateAnswerButtonLoading = computeIsUpdateAnswerButtonLoading(
            currentMultiplier,
            isQuestionManuallyCorrected,
            loadingInfo,
        );

        expect(isUpdateAnswerButtonLoading).toBe(true);
    });

    it('should return true if add acceptable answer for right currentMultiplier', () => {
        const currentMultiplier = 0.5;
        const isQuestionManuallyCorrected = false;
        const loadingInfo = {
            removeOkAnswer: true,
            addAcceptableAnswer: 0.5,
            saveMark: undefined,
        };

        const isUpdateAnswerButtonLoading = computeIsUpdateAnswerButtonLoading(
            currentMultiplier,
            isQuestionManuallyCorrected,
            loadingInfo,
        );

        expect(isUpdateAnswerButtonLoading).toBe(true);
    });

    it('should return false if add acceptable answer for wrong currentMultiplier', () => {
        const currentMultiplier = 0.5;
        const isQuestionManuallyCorrected = false;
        const loadingInfo = {
            removeOkAnswer: true,
            addAcceptableAnswer: 0.25,
            saveMark: undefined,
        };

        const isUpdateAnswerButtonLoading = computeIsUpdateAnswerButtonLoading(
            currentMultiplier,
            isQuestionManuallyCorrected,
            loadingInfo,
        );

        expect(isUpdateAnswerButtonLoading).toBe(false);
    });

    it('should return true if save mark and correct multiplier', () => {
        const currentMultiplier = 0.5;
        const isQuestionManuallyCorrected = true;
        const loadingInfo = {
            removeOkAnswer: false,
            addAcceptableAnswer: undefined,
            saveMark: 0.5,
        };

        const isUpdateAnswerButtonLoading = computeIsUpdateAnswerButtonLoading(
            currentMultiplier,
            isQuestionManuallyCorrected,
            loadingInfo,
        );

        expect(isUpdateAnswerButtonLoading).toBe(true);
    });

    it('should return false if save mark and wrong multiplier', () => {
        const currentMultiplier = 0.5;
        const isQuestionManuallyCorrected = true;
        const loadingInfo = {
            removeOkAnswer: false,
            addAcceptableAnswer: undefined,
            saveMark: 0.25,
        };

        const isUpdateAnswerButtonLoading = computeIsUpdateAnswerButtonLoading(
            currentMultiplier,
            isQuestionManuallyCorrected,
            loadingInfo,
        );

        expect(isUpdateAnswerButtonLoading).toBe(false);
    });
});
