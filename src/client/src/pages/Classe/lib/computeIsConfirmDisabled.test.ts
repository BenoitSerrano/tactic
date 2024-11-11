import { computeIsConfirmDisabled } from './computeIsConfirmDisabled';

describe('computeIsConfirmDisabled', () => {
    it('should return true if no name is provided', () => {
        const name = '';
        const duration = '60';
        const startDateTime = 1731183529267;
        const endDateTime = Infinity;

        const isConfirmDisabled = computeIsConfirmDisabled({
            name,
            duration,

            startDateTime,
            endDateTime,
        });

        expect(isConfirmDisabled).toBe(true);
    });

    it('should return true if no duration is provided', () => {
        const name = 'exam name';
        const duration = '';
        const startDateTime = 1731183529267;
        const endDateTime = Infinity;

        const isConfirmDisabled = computeIsConfirmDisabled({
            name,
            duration,

            startDateTime,
            endDateTime,
        });

        expect(isConfirmDisabled).toBe(true);
    });

    it('should return true if duration is 0', () => {
        const name = 'exam name';
        const duration = '00';
        const startDateTime = 1731183529267;
        const endDateTime = Infinity;

        const isConfirmDisabled = computeIsConfirmDisabled({
            name,
            duration,

            startDateTime,
            endDateTime,
        });

        expect(isConfirmDisabled).toBe(true);
    });

    it('should return false if all the fields are filled with acceptable values', () => {
        const name = 'exam name';
        const duration = '60';
        const startDateTime = 1731183529267;
        const endDateTime = Infinity;

        const isConfirmDisabled = computeIsConfirmDisabled({
            name,
            duration,

            startDateTime,
            endDateTime,
        });

        expect(isConfirmDisabled).toBe(false);
    });
});
