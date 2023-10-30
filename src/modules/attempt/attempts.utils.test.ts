import { Exam } from '../exam';
import { Attempt } from './Attempt.entity';
import { attemptUtils } from './attempt.utils';

describe('attemptsUtils', () => {
    describe('computeIsTimeLimitExceeded', () => {
        const exam = new Exam();
        exam.name = 'exam';
        exam.duration = 15;
        exam.extraTime = 2;

        it('is in white zone', () => {
            const attempt = new Attempt();
            attempt.exam = exam;
            attempt.startedAt = '2023-06-19T19:00:00.858Z';

            expect(
                attemptUtils.computeIsTimeLimitExceeded(
                    attempt,
                    new Date('2023-06-19T19:06:00.858Z'),
                ),
            ).toBe(false);
        });

        it('is in gray zone', () => {
            const attempt = new Attempt();
            attempt.exam = exam;
            attempt.startedAt = '2023-06-19T19:00:00.858Z';

            expect(
                attemptUtils.computeIsTimeLimitExceeded(
                    attempt,
                    new Date('2023-06-19T19:16:00.858Z'),
                ),
            ).toBe(false);
        });

        it('is exceeded', () => {
            const attempt = new Attempt();
            attempt.exam = exam;
            attempt.startedAt = '2023-06-19T19:00:00.858Z';

            expect(
                attemptUtils.computeIsTimeLimitExceeded(
                    attempt,
                    new Date('2023-06-19T19:18:00.858Z'),
                ),
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
