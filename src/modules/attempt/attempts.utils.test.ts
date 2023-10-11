import { Exam } from '../exam';
import { Attempt } from './Attempt.entity';
import { attemptUtils } from './attempt.utils';

describe('attemptsUtils', () => {
    describe('isTimeLimitExceeded', () => {
        const exam = new Exam();
        exam.name = 'exam';
        exam.duration = 15;
        exam.extraTime = 2;

        it('is in white zone', () => {
            const attempt = new Attempt();
            attempt.exam = exam;
            attempt.startedAt = '2023-06-19T19:00:00.858Z';

            expect(
                attemptUtils.isTimeLimitExceeded(attempt, new Date('2023-06-19T19:06:00.858Z')),
            ).toBe(false);
        });

        it('is in gray zone', () => {
            const attempt = new Attempt();
            attempt.exam = exam;
            attempt.startedAt = '2023-06-19T19:00:00.858Z';

            expect(
                attemptUtils.isTimeLimitExceeded(attempt, new Date('2023-06-19T19:16:00.858Z')),
            ).toBe(false);
        });

        it('is exceeded', () => {
            const attempt = new Attempt();
            attempt.exam = exam;
            attempt.startedAt = '2023-06-19T19:00:00.858Z';

            expect(
                attemptUtils.isTimeLimitExceeded(attempt, new Date('2023-06-19T19:18:00.858Z')),
            ).toBe(true);
        });
    });

    describe('stringifyAnswers', () => {
        const attemptAnswers = {
            qcmChoices: { 1: 2, 2: 3 },
            questionTrouAnswers: { 1: 'truc' },
            phraseMelangeeAnswers: { 3: 'are you even sure' },
        };

        const answers = attemptUtils.stringifyAnswers(attemptAnswers);

        expect(answers).toEqual(['QCM:1-2', 'QCM:2-3', 'QT:1-truc', 'PM:3-are you even sure']);
    });
    describe('parseAnswers', () => {
        const answers = ['QCM:1-2', 'QCM:2-3', 'QT:1-truc', 'PM:3-are you even sure'];

        const attemptAnswers = attemptUtils.parseAnswers(answers);

        expect(attemptAnswers).toEqual({
            qcmChoices: { 1: '2', 2: '3' },
            questionTrouAnswers: { 1: 'truc' },
            phraseMelangeeAnswers: { 3: 'are you even sure' },
        });
    });
});
