import { Exam } from '../exam';
import { Question } from '../question';
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

    describe.only('convertAnswersToMarks', () => {
        const questions = {
            1: {
                id: 1,
                kind: 'qcm' as const,
                title: 'la 2ème lettre ?',
                possibleAnswers: ['A', 'B', 'C', 'D'],
                rightAnswers: ['1'],
                acceptableAnswers: [],
                points: 1,
            },
            2: {
                id: 2,
                kind: 'phraseMelangee' as const,
                title: 'belle es tu',
                possibleAnswers: [],
                rightAnswers: ['tu es belle', 'es tu belle'],
                acceptableAnswers: [],
                points: 3,
            },
            3: {
                id: 3,
                kind: 'questionTrou' as const,
                title: '.... est une couleur',
                possibleAnswers: [],
                rightAnswers: ['bleu', 'rouge'],
                acceptableAnswers: ['blanc', 'noir'],
                points: 11,
            },
        };
        it('should convert to marks', () => {
            const answers = { 1: '1', 2: 'es tu belle', 3: 'blanc' };

            const marks = attemptUtils.computeMarks(questions, answers);

            expect(marks).toEqual(['1:1', '2:3', '3:5.5']);
        });
    });
});
