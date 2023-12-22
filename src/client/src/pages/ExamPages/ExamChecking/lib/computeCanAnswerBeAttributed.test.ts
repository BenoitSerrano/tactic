import { acceptableAnswerWithPointsType } from '../../../../types';
import { computeCanAnswerBeAttributed } from './computeCanAnswerBeAttributed';

describe('computeCanAnswerBeAttributed', () => {
    const baseQuestion = {
        id: 2,
        title: '',
        kind: 'qcm' as const,
        possibleAnswers: [],
        answer: 'chouette',
        points: 2,
    };
    describe('acceptable', () => {
        it('should return true for acceptable if answer status is wrong', () => {
            const newMark = 1;
            const mark = 0;
            const acceptableAnswers = [
                { points: 2, answer: 'truc' },
                { points: 1, answer: 'bidule' },
            ];
            const question = {
                ...baseQuestion,
                mark,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for acceptable if answer is empty', () => {
            const newMark = 1;
            const mark = 0;
            const acceptableAnswers = [
                { points: 2, answer: 'truc' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                answer: undefined,
                mark,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return false for acceptable if answer status is acceptable', () => {
            const newMark = 1;
            const mark = 1;
            const acceptableAnswers = [
                { points: 2, answer: 'truc' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                mark,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return false for acceptable if answer status is right but it is the only right answer', () => {
            const newMark = 1;
            const mark = 2;
            const acceptableAnswers = [
                { points: 2, answer: 'chouette' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                mark,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return true for acceptable if answer status is right and it has several right answers', () => {
            const newMark = 1;
            const mark = 2;
            const acceptableAnswers = [
                { points: 2, answer: 'truc' },
                { points: 2, answer: 'chouette' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                mark,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });
    });
    describe('wrong', () => {
        it('should return true for wrong if answer status is acceptable', () => {
            const newMark = 0;
            const mark = 1;
            const acceptableAnswers = [
                { points: 2, answer: 'truc' },
                { points: 1, answer: 'chouette' },
            ];

            const question = {
                ...baseQuestion,
                mark,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for wrong if answer status is wrong', () => {
            const newMark = 0;
            const mark = 0;
            const acceptableAnswers = [{ points: 2, answer: 'truc' }];

            const question = {
                ...baseQuestion,
                mark,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        // it.only('should return false for wrong if mark is undefined', () => {
        //     const newMark = 0;
        //     const mark = undefined;
        //     const answer = undefined;
        //     const acceptableAnswers: acceptableAnswerWithPointsType[] = [];

        //     const question = {
        //         ...baseQuestion,
        //         answer,
        //         mark,
        //         acceptableAnswers,
        //     };

        //     const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);

        //     expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        // });

        it('should return false for wrong if answer is undefined or empty', () => {
            const newMark = 0;
            const mark = 0;
            const answer = '';
            const acceptableAnswers: acceptableAnswerWithPointsType[] = [
                { points: 2, answer: 'truc' },
            ];

            const question = {
                ...baseQuestion,
                mark,
                answer,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);
            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return false for wrong if answer status is right but it is the only right answer', () => {
            const newMark = 0;
            const mark = 2;
            const acceptableAnswers = [
                { points: 2, answer: 'chouette' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                mark,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return true for wrong if answer status is right and it has several right answers', () => {
            const newMark = 0;
            const mark = 2;
            const acceptableAnswers = [
                { points: 2, answer: 'truc' },
                { points: 2, answer: 'chouette' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                mark,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });
    });

    describe('right', () => {
        it('should return true for right if answer status is wrong', () => {
            const newMark = 2;
            const mark = 0;
            const acceptableAnswers = [
                { points: 2, answer: 'truc' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                mark,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for right if answer status is wrong but answer is empty', () => {
            const newMark = 2;
            const mark = 0;
            const acceptableAnswers = [
                { points: 2, answer: 'truc' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                answer: undefined,
                mark,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return true for right if answer status is acceptable', () => {
            const newMark = 2;
            const mark = 1;
            const acceptableAnswers = [
                { points: 2, answer: 'truc' },
                { points: 1, answer: 'chouette' },
            ];

            const question = {
                ...baseQuestion,
                mark,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for right if answer status is right', () => {
            const newMark = 2;
            const mark = 2;
            const acceptableAnswers = [
                { points: 2, answer: 'chouette' },
                { points: 1, answer: 'machin' },
            ];

            const question = {
                ...baseQuestion,
                mark,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newMark, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });
    });
});
