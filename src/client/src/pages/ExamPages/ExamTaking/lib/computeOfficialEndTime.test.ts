import { computeOfficialEndTime } from './computeOfficialEndTime';

describe('computeOfficialEndTime', () => {
    const duration = 90;
    const startedAt = '2023-07-24 07:00:00.000 +0200';

    it('should compute the official end time', () => {
        const officialEndTime = computeOfficialEndTime({
            duration,
            startedAt,
        });

        expect(officialEndTime).toBe('08:30');
    });
});
