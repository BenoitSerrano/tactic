import { computeHasEditedMarks } from './computeHasEditedMarks';

describe('computeHasEditedMarks', () => {
    it('should return true if has added marks', () => {
        const initialMarks = {};
        const currentMarks = { 2: '1' };

        const hasEditedMarks = computeHasEditedMarks(initialMarks, currentMarks);

        expect(hasEditedMarks).toBe(true);
    });

    it('should return true if has removed marks', () => {
        const initialMarks = { 2: '1' };
        const currentMarks = { 2: '' };

        const hasEditedMarks = computeHasEditedMarks(initialMarks, currentMarks);

        expect(hasEditedMarks).toBe(true);
    });

    it('should return false if marks are identical', () => {
        const initialMarks = { 1: '2', 2: '1' };
        const currentMarks = { 2: '1', 1: '2' };

        const hasEditedMarks = computeHasEditedMarks(initialMarks, currentMarks);

        expect(hasEditedMarks).toBe(false);
    });
});
