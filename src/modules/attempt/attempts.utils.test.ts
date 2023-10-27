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

    describe('convertAnswersToMarks', () => {
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

        describe('decodeMarks', () => {
            it('should decode marks', () => {
                const str = ['131:1', '132:1', '133:3'];

                const marks = attemptUtils.decodeMarks(str);

                expect(marks).toEqual({ 131: 1, 132: 1, 133: 3 });
            });
        });
    });
});
