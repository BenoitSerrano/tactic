import { computeOfficialEndTime } from './computeOfficialEndTime';

describe('computeOfficialEndTime', () => {
    const duration = 90;
    const startedAt = '2023-07-24 07:00:00.000 +0200';

    it('should compute the official end time', () => {
        const shouldNavigateToExamDone = computeOfficialEndTime({
            duration,
            startedAt,
        });

        expect(shouldNavigateToExamDone).toBe('08:30');
    });
});
