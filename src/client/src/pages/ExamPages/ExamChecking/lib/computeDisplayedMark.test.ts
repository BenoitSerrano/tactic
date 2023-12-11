import { computeDisplayedMark } from './computeDisplayedMark';

describe('computeDisplayedMark', () => {
    const totalPoints = 1;
    it('should return the mark for automatic questions even if answer not filled', () => {
        const answer = undefined;
        const mark = 0;
        const isQuestionManuallyCorrected = false;

        const displayedMark = computeDisplayedMark({
            mark,
            answer,
            isQuestionManuallyCorrected,
            totalPoints,
        });

        expect(displayedMark).toBe(`0 / 1`);
    });

    it('should return the mark for automatic questions if answer filled', () => {
        const answer = 'truc';
        const mark = 1;
        const isQuestionManuallyCorrected = false;

        const displayedMark = computeDisplayedMark({
            mark,
            answer,
            isQuestionManuallyCorrected,
            totalPoints,
        });

        expect(displayedMark).toBe(`1 / 1`);
    });

    it('should display a default 0 for manual questions if answer not filled', () => {
        const answer = undefined;
        const mark = undefined;
        const isQuestionManuallyCorrected = true;

        const displayedMark = computeDisplayedMark({
            mark,
            answer,
            isQuestionManuallyCorrected,
            totalPoints,
        });

        expect(displayedMark).toBe(`0 / 1`);
    });

    it('should display ... for manual questions if answer filled but mark not yet attributed', () => {
        const answer = 'truc';
        const mark = undefined;
        const isQuestionManuallyCorrected = true;

        const displayedMark = computeDisplayedMark({
            mark,
            answer,
            isQuestionManuallyCorrected,
            totalPoints,
        });

        expect(displayedMark).toBe(`... / 1`);
    });
});
