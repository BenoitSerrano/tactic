import { gradeType } from '../../../../types';
import { computeDisplayedMark } from './computeDisplayedMark';

describe('computeDisplayedMark', () => {
    const totalPoints = 1;
    it('should return the grade for automatic questions even if answer not filled', () => {
        const answer = undefined;
        const grade = 'E' as gradeType;
        const isQuestionManuallyCorrected = false;

        const displayedMark = computeDisplayedMark({
            grade,
            answer,
            isQuestionManuallyCorrected,
            totalPoints,
        });

        expect(displayedMark).toBe(`0 / 1`);
    });

    it('should return the grade for automatic questions if answer filled', () => {
        const answer = 'truc';
        const grade = 'A' as gradeType;
        const isQuestionManuallyCorrected = false;

        const displayedMark = computeDisplayedMark({
            grade,
            answer,
            isQuestionManuallyCorrected,
            totalPoints,
        });

        expect(displayedMark).toBe(`1 / 1`);
    });

    it('should display a default 0 for manual questions if answer not filled', () => {
        const answer = undefined;
        const grade = undefined;
        const isQuestionManuallyCorrected = true;

        const displayedMark = computeDisplayedMark({
            grade,
            answer,
            isQuestionManuallyCorrected,
            totalPoints,
        });

        expect(displayedMark).toBe(`0 / 1`);
    });

    it('should display ... for manual questions if answer filled but grade not yet attributed', () => {
        const answer = 'truc';
        const grade = undefined;
        const isQuestionManuallyCorrected = true;

        const displayedMark = computeDisplayedMark({
            grade,
            answer,
            isQuestionManuallyCorrected,
            totalPoints,
        });

        expect(displayedMark).toBe(`... / 1`);
    });
});
