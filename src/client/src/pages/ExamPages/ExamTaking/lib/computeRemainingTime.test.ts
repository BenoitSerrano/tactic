import { computeRemainingTime } from './computeRemainingTime';

describe('computeRemainingTime', () => {
    const startedAt = '2023-07-24 07:00:00.000 +0200';
    const now = new Date('2023-07-24 08:25:00.000 +0200');

    it('should compute the remaining time', () => {
        const duration = 90;

        const remainingTime = computeRemainingTime(
            {
                duration,
                startedAt,
            },
            now,
        );

        expect(remainingTime).toBe(5 * 60 * 1000);
    });

    it('should return Infinity if no duration', () => {
        const duration = null;

        const remainingTime = computeRemainingTime(
            {
                duration,
                startedAt,
            },
            now,
        );

        expect(remainingTime).toBe(Infinity);
    });
});
