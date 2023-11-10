import { computeShouldNavigateToExamDone } from './computeShouldNavigateToExamDone';

describe('computeShouldNavigateToExamDone', () => {
    const extraTime = 5;
    const duration = 60;
    const startedAt = '2023-07-24 07:00:00.000 +0200';

    it('should navigate if time is elapsed beyond extra time', () => {
        const now = new Date('2023-07-24 08:05:20.429 +0200');
        const endedAt = undefined;

        const shouldNavigateToExamDone = computeShouldNavigateToExamDone(now, {
            duration,
            startedAt,
            endedAt,
            extraTime,
        });

        expect(shouldNavigateToExamDone).toBe(true);
    });

    it('should not navigate if time is not yet elapsed', () => {
        const now = new Date('2023-07-24 07:37:20.429 +0200');
        const endedAt = undefined;

        const shouldNavigateToExamDone = computeShouldNavigateToExamDone(now, {
            duration,
            startedAt,
            endedAt,
            extraTime,
        });

        expect(shouldNavigateToExamDone).toBe(false);
    });

    it('should not navigate if time is still within the extra time allowed', () => {
        const now = new Date('2023-07-24 08:02:20.429 +0200');
        const endedAt = undefined;

        const shouldNavigateToExamDone = computeShouldNavigateToExamDone(now, {
            duration,
            startedAt,
            endedAt,
            extraTime,
        });

        expect(shouldNavigateToExamDone).toBe(false);
    });

    it('should navigate if test is already ended', () => {
        const now = new Date('2023-07-24 07:37:20.429 +0200');
        const endedAt = '2023-07-24 07:30:20.429 +0200';

        const shouldNavigateToExamDone = computeShouldNavigateToExamDone(now, {
            duration,
            startedAt,
            endedAt,
            extraTime,
        });

        expect(shouldNavigateToExamDone).toBe(true);
    });
});
