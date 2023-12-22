import { gradeType } from '../../../../types';
import { computeIsUpdateAnswerButtonLoading } from './computeIsUpdateAnswerButtonLoading';

describe('computeIsUpdateAnswerButtonLoading', () => {
    it('should return true if remove ok answer', () => {
        const currentGrade = 'E';
        const isQuestionManuallyCorrected = false;
        const loadingInfo = {
            removeOkAnswer: true,
            addAcceptableAnswer: undefined,
            updateGrade: undefined,
        };

        const isUpdateAnswerButtonLoading = computeIsUpdateAnswerButtonLoading(
            currentGrade,
            isQuestionManuallyCorrected,
            loadingInfo,
        );

        expect(isUpdateAnswerButtonLoading).toBe(true);
    });

    it('should return true if add acceptable answer for right currentGrade', () => {
        const currentGrade = 'C';
        const isQuestionManuallyCorrected = false;
        const loadingInfo = {
            removeOkAnswer: true,
            addAcceptableAnswer: 'C' as gradeType,
            updateGrade: undefined,
        };

        const isUpdateAnswerButtonLoading = computeIsUpdateAnswerButtonLoading(
            currentGrade,
            isQuestionManuallyCorrected,
            loadingInfo,
        );

        expect(isUpdateAnswerButtonLoading).toBe(true);
    });

    it('should return false if add acceptable answer for wrong currentGrade', () => {
        const currentGrade = 'C';
        const isQuestionManuallyCorrected = false;
        const loadingInfo = {
            removeOkAnswer: true,
            addAcceptableAnswer: 'D' as gradeType,
            updateGrade: undefined,
        };

        const isUpdateAnswerButtonLoading = computeIsUpdateAnswerButtonLoading(
            currentGrade,
            isQuestionManuallyCorrected,
            loadingInfo,
        );

        expect(isUpdateAnswerButtonLoading).toBe(false);
    });

    it('should return true if save mark and correct multiplier', () => {
        const currentGrade = 'C';
        const isQuestionManuallyCorrected = true;
        const loadingInfo = {
            removeOkAnswer: false,
            addAcceptableAnswer: undefined,
            updateGrade: 'C' as gradeType,
        };

        const isUpdateAnswerButtonLoading = computeIsUpdateAnswerButtonLoading(
            currentGrade,
            isQuestionManuallyCorrected,
            loadingInfo,
        );

        expect(isUpdateAnswerButtonLoading).toBe(true);
    });

    it('should return false if save mark and wrong multiplier', () => {
        const currentGrade = 'C';
        const isQuestionManuallyCorrected = true;
        const loadingInfo = {
            removeOkAnswer: false,
            addAcceptableAnswer: undefined,
            updateGrade: 'D' as gradeType,
        };

        const isUpdateAnswerButtonLoading = computeIsUpdateAnswerButtonLoading(
            currentGrade,
            isQuestionManuallyCorrected,
            loadingInfo,
        );

        expect(isUpdateAnswerButtonLoading).toBe(false);
    });
});
