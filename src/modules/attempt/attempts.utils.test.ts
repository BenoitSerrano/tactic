import { attemptUtils } from './attempt.utils';

describe('attemptsUtils', () => {
    describe('computeIsTimeLimitExceeded', () => {
        const duration = 15;
        const extraTime = 2;

        it('is in white zone', () => {
            const startedAt = '2023-06-19T19:00:00.858Z';
            const now = new Date('2023-06-19T19:06:00.858Z');

            expect(
                attemptUtils.computeIsTimeLimitExceeded({ duration, extraTime, startedAt, now }),
            ).toBe(false);
        });

        it('is in gray zone', () => {
            const startedAt = '2023-06-19T19:00:00.858Z';
            const now = new Date('2023-06-19T19:16:00.858Z');

            expect(
                attemptUtils.computeIsTimeLimitExceeded({ duration, extraTime, startedAt, now }),
            ).toBe(false);
        });

        it('is exceeded', () => {
            const startedAt = '2023-06-19T19:00:00.858Z';
            const now = new Date('2023-06-19T19:18:00.858Z');

            expect(
                attemptUtils.computeIsTimeLimitExceeded({ duration, extraTime, startedAt, now }),
            ).toBe(true);
        });
    });

    describe('convertAnswersToMarks', () => {
        describe('decodeMarks', () => {
            it('should decode marks', () => {
                const str = ['131:1', '132:1', '133:3'];

                const marks = attemptUtils.decodeMarks(str);

                expect(marks).toEqual({ 131: 1, 132: 1, 133: 3 });
            });
        });
    });
});
