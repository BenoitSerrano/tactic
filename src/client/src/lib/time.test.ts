import { time } from './time';

describe('time', () => {
    describe('formatToClock', () => {
        it('00:00:00', () => {
            expect(time.formatToClock(-10)).toBe('00:00:00');
        });
        it('00:00:09', () => {
            expect(time.formatToClock(9)).toBe('00:00:09');
        });
        it('00:00:12', () => {
            expect(time.formatToClock(12)).toBe('00:00:12');
        });
        it('00:03:09', () => {
            expect(time.formatToClock(189)).toBe('00:03:09');
        });
        it('03:09', () => {
            expect(time.formatToClock(189, { hideHours: true })).toBe('03:09');
        });
        it('02:02:13', () => {
            expect(time.formatToClock(7333)).toBe('02:02:13');
        });
    });

    describe('computeElapsedTime', () => {
        it('600', () => {
            const date = '2023-06-19T19:06:35.858Z';
            expect(time.computeElapsedTime(date, new Date('2023-06-19T19:16:35.858Z'))).toBe(600);
        });
    });
});
