import { computeRoundMark } from './computeRoundMark';

describe('computeRoundMark', () => {
    it('should not display a comma if integer', () => {
        const mark = 5;

        const roundedMark = computeRoundMark(mark);

        expect(roundedMark).toBe('5');
    });

    it('should display a comma if 1.5', () => {
        const mark = 1.5;

        const roundedMark = computeRoundMark(mark);

        expect(roundedMark).toBe('1.5');
    });

    it('should display a comma if 1.25', () => {
        const mark = 1.25;

        const roundedMark = computeRoundMark(mark);

        expect(roundedMark).toBe('1.25');
    });
    it('should round to 1.25 integer if 1.27', () => {
        const mark = 1.27;

        const roundedMark = computeRoundMark(mark);

        expect(roundedMark).toBe('1.25');
    });

    it('should round to superior integer if 1.9', () => {
        const mark = 1.9;

        const roundedMark = computeRoundMark(mark);

        expect(roundedMark).toBe('2');
    });

    it('should round to 1 if 1.1', () => {
        const mark = 1.1;

        const roundedMark = computeRoundMark(mark);

        expect(roundedMark).toBe('1');
    });

    it('should round to 0.25 if 1/3', () => {
        const mark = 1 / 3;

        const roundedMark = computeRoundMark(mark);

        expect(roundedMark).toBe('0.25');
    });
});
