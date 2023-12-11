import { computeCanAnswerBeAttributed } from './computeCanAnswerBeAttributed';

describe('computeCanAnswerBeAttributed', () => {
    const baseQuestion = {
        id: 2,
        title: '',
        kind: 'qcm' as const,
        possibleAnswers: [],
        answer: 'chouette',
        mark: 2,
        points: 2,
    };
    describe('acceptable', () => {
        it('should return true for acceptable if answer status is wrong', () => {
            const newPoints = 1;
            const currentPoints = 0;
            const acceptableAnswersWithPoints = [
                { points: 2, answer: 'truc' },
                { points: 1, answer: 'bidule' },
            ];
            const question = {
                ...baseQuestion,
                acceptableAnswersWithPoints,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(
                newPoints,
                currentPoints,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for acceptable if answer is empty', () => {
            const newPoints = 1;
            const currentPoints = 0;
            const acceptableAnswersWithPoints = [
                { points: 2, answer: 'truc' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                answer: undefined,
                acceptableAnswersWithPoints,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(
                newPoints,
                currentPoints,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return false for acceptable if answer status is acceptable', () => {
            const newPoints = 1;
            const currentPoints = 1;
            const acceptableAnswersWithPoints = [
                { points: 2, answer: 'truc' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                acceptableAnswersWithPoints,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(
                newPoints,
                currentPoints,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return false for acceptable if answer status is right but it is the only right answer', () => {
            const newPoints = 1;
            const currentPoints = 2;
            const acceptableAnswersWithPoints = [
                { points: 2, answer: 'chouette' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                acceptableAnswersWithPoints,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(
                newPoints,
                currentPoints,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return true for acceptable if answer status is right and it has several right answers', () => {
            const newPoints = 1;
            const currentPoints = 2;
            const acceptableAnswersWithPoints = [
                { points: 2, answer: 'truc' },
                { points: 2, answer: 'chouette' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                acceptableAnswersWithPoints,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(
                newPoints,
                currentPoints,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });
    });
    describe('wrong', () => {
        it('should return true for wrong if answer status is acceptable', () => {
            const newPoints = 0;
            const currentPoints = 1;
            const acceptableAnswersWithPoints = [
                { points: 2, answer: 'truc' },
                { points: 1, answer: 'chouette' },
            ];

            const question = {
                ...baseQuestion,
                acceptableAnswersWithPoints,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(
                newPoints,
                currentPoints,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for wrong if answer status is wrong', () => {
            const newPoints = 0;
            const currentPoints = 0;
            const acceptableAnswersWithPoints = [{ points: 2, answer: 'truc' }];

            const question = {
                ...baseQuestion,
                acceptableAnswersWithPoints,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(
                newPoints,
                currentPoints,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return false for wrong if answer status is right but it is the only right answer', () => {
            const newPoints = 0;
            const currentPoints = 2;
            const acceptableAnswersWithPoints = [
                { points: 2, answer: 'chouette' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                acceptableAnswersWithPoints,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(
                newPoints,
                currentPoints,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return true for wrong if answer status is right and it has several right answers', () => {
            const newPoints = 0;
            const currentPoints = 2;
            const acceptableAnswersWithPoints = [
                { points: 2, answer: 'truc' },
                { points: 2, answer: 'chouette' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                acceptableAnswersWithPoints,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(
                newPoints,
                currentPoints,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });
    });

    describe('right', () => {
        it('should return true for right if answer status is wrong', () => {
            const newPoints = 2;
            const currentPoints = 0;
            const acceptableAnswersWithPoints = [
                { points: 2, answer: 'truc' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                acceptableAnswersWithPoints,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(
                newPoints,
                currentPoints,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for right if answer status is wrong but answer is empty', () => {
            const newPoints = 2;
            const currentPoints = 0;
            const acceptableAnswersWithPoints = [
                { points: 2, answer: 'truc' },
                { points: 1, answer: 'bidule' },
            ];

            const question = {
                ...baseQuestion,
                answer: undefined,
                acceptableAnswersWithPoints,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(
                newPoints,
                currentPoints,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return true for right if answer status is acceptable', () => {
            const newPoints = 2;
            const currentPoints = 1;
            const acceptableAnswersWithPoints = [
                { points: 2, answer: 'truc' },
                { points: 1, answer: 'chouette' },
            ];

            const question = {
                ...baseQuestion,
                acceptableAnswersWithPoints,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(
                newPoints,
                currentPoints,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for right if answer status is right', () => {
            const newPoints = 2;
            const currentPoints = 2;
            const acceptableAnswersWithPoints = [
                { points: 2, answer: 'chouette' },
                { points: 1, answer: 'machin' },
            ];

            const question = {
                ...baseQuestion,
                acceptableAnswersWithPoints,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(
                newPoints,
                currentPoints,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });
    });
});
