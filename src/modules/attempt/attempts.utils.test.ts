import { acceptableAnswerType, gradeType } from '../question/types';
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

    describe('computeNotationInfo', () => {
        const answers = {
            24650: 'MQ==',
            24651: 'dHJ1Yw==',
            24652: 'ZXN0IGJlbGxlIGxhIHZpZQ==',
            24653: 'bGF8bWFjaGlu',
            24654: 'Ym9m',
        };
        const points = 2;
        const order = 0;
        it('should compute notation info for qcm', () => {
            const question = {
                id: 24650,
                kind: 'qcm' as const,
                title: 'Question',
                points,
                order,
                possibleAnswers: ['Oui', 'Non'],
                acceptableAnswers: [[{ grade: 'A' as gradeType, answer: 'MQ==' }]],
            };
            const manualMarks: string[] = [];

            const notationInfo = attemptUtils.computeNotationInfo({
                answers,
                question,
                manualMarks,
            });

            expect(notationInfo).toEqual({ grade: 'A', mark: 2 });
        });

        it('should compute notation info for texte libre with answers but no manualMarks', () => {
            const question = {
                id: 24654,
                kind: 'texteLibre' as const,
                title: 'Libre',
                points,
                order,
                possibleAnswers: [],
                acceptableAnswers: [[]] as acceptableAnswerType[][],
            };
            const manualMarks: string[] = [];

            const notationInfo = attemptUtils.computeNotationInfo({
                answers,
                question,
                manualMarks,
            });

            expect(notationInfo).toEqual({ grade: undefined, mark: undefined });
        });

        it('should compute notation info for texte libre with answers and manualMarks', () => {
            const question = {
                id: 24654,
                kind: 'texteLibre' as const,
                title: 'Libre',
                points,
                order,
                possibleAnswers: [],
                acceptableAnswers: [[]] as acceptableAnswerType[][],
            };
            const manualMarks: string[] = ['24654:1.5'];

            const notationInfo = attemptUtils.computeNotationInfo({
                answers,
                question,
                manualMarks,
            });

            expect(notationInfo).toEqual({ grade: undefined, mark: 1.5 });
        });
    });
});
