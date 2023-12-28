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
        describe('decodeGrades', () => {
            it('should decode grades', () => {
                const str = ['131:B', '132:B', '133:A'];

                const marks = attemptUtils.decodeGrades(str);

                expect(marks).toEqual({ 131: 'B', 132: 'B', 133: 'A' });
            });
        });
    });
});
