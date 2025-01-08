import { computeDateTime } from './computeDateTimeExtremums';

describe('computeDateTimeExtremums', () => {
    describe('computeDateTime', () => {
        it('should return undefined if time empty', () => {
            const date = '2024-12-31';
            const time = '';

            const startDateTime = computeDateTime(date, time);

            expect(startDateTime).toBe(undefined);
        });
        it('should return undefined if date empty', () => {
            const date = '';
            const time = '12:12';

            const startDateTime = computeDateTime(date, time);

            expect(startDateTime).toBe(undefined);
        });

        it('should return dateTime if date and time valid', () => {
            const date = '2024-12-31';
            const time = '14:12';

            const startDateTime = computeDateTime(date, time);

            expect(startDateTime?.getTime()).toBe(1735650720000);
        });
    });
});
