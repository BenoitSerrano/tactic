import { computeCanAnswerBeMarkedAs } from './computeCanAnswerBeMarkedAs';

describe('computeCanAnswerBeMarkedAs', () => {
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
            const newStatus = 'acceptable';
            const currentAnswerStatus = 'wrong';
            const rightAnswers: string[] = ['truc'];
            const acceptableAnswers: string[] = ['bidule'];
            const question = {
                ...baseQuestion,
                rightAnswers,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeMarkedAs(
                newStatus,
                currentAnswerStatus,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for acceptable if answer is empty', () => {
            const newStatus = 'acceptable';
            const currentAnswerStatus = 'wrong';
            const rightAnswers: string[] = ['truc'];
            const acceptableAnswers: string[] = ['bidule'];
            const question = {
                ...baseQuestion,
                answer: undefined,
                rightAnswers,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeMarkedAs(
                newStatus,
                currentAnswerStatus,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return false for acceptable if answer status is acceptable', () => {
            const newStatus = 'acceptable';
            const currentAnswerStatus = 'acceptable';
            const rightAnswers: string[] = ['truc'];
            const acceptableAnswers: string[] = ['bidule'];
            const question = {
                ...baseQuestion,
                rightAnswers,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeMarkedAs(
                newStatus,
                currentAnswerStatus,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return false for acceptable if answer status is right but it is the only right answer', () => {
            const newStatus = 'acceptable';
            const currentAnswerStatus = 'right';
            const rightAnswers: string[] = ['chouette'];
            const acceptableAnswers: string[] = ['bidule'];
            const question = {
                ...baseQuestion,
                rightAnswers,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeMarkedAs(
                newStatus,
                currentAnswerStatus,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return true for acceptable if answer status is right and it has several right answers', () => {
            const newStatus = 'acceptable';
            const currentAnswerStatus = 'right';
            const rightAnswers: string[] = ['chouette', 'truc'];
            const acceptableAnswers: string[] = ['bidule'];
            const question = {
                ...baseQuestion,
                rightAnswers,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeMarkedAs(
                newStatus,
                currentAnswerStatus,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });
    });
    describe('wrong', () => {
        it('should return true for wrong if answer status is acceptable', () => {
            const newStatus = 'wrong';
            const currentAnswerStatus = 'acceptable';
            const rightAnswers: string[] = ['truc'];
            const acceptableAnswers: string[] = ['chouette'];
            const question = {
                ...baseQuestion,
                rightAnswers,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeMarkedAs(
                newStatus,
                currentAnswerStatus,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for wrong if answer status is wrong', () => {
            const newStatus = 'wrong';
            const currentAnswerStatus = 'wrong';
            const rightAnswers: string[] = ['truc'];
            const acceptableAnswers: string[] = [];
            const question = {
                ...baseQuestion,
                rightAnswers,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeMarkedAs(
                newStatus,
                currentAnswerStatus,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return false for wrong if answer status is right but it is the only right answer', () => {
            const newStatus = 'wrong';
            const currentAnswerStatus = 'right';
            const rightAnswers: string[] = ['chouette'];
            const acceptableAnswers: string[] = ['bidule'];
            const question = {
                ...baseQuestion,
                rightAnswers,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeMarkedAs(
                newStatus,
                currentAnswerStatus,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return true for wrong if answer status is right and it has several right answers', () => {
            const newStatus = 'wrong';
            const currentAnswerStatus = 'right';
            const rightAnswers: string[] = ['chouette', 'truc'];
            const acceptableAnswers: string[] = ['bidule'];
            const question = {
                ...baseQuestion,
                rightAnswers,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeMarkedAs(
                newStatus,
                currentAnswerStatus,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });
    });

    describe('right', () => {
        it('should return true for right if answer status is wrong', () => {
            const newStatus = 'right';
            const currentAnswerStatus = 'wrong';
            const rightAnswers: string[] = ['truc'];
            const acceptableAnswers: string[] = ['bidule'];
            const question = {
                ...baseQuestion,
                rightAnswers,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeMarkedAs(
                newStatus,
                currentAnswerStatus,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for right if answer status is wrong but answer is empty', () => {
            const newStatus = 'right';
            const currentAnswerStatus = 'wrong';
            const rightAnswers: string[] = ['truc'];
            const acceptableAnswers: string[] = ['bidule'];
            const question = {
                ...baseQuestion,
                answer: undefined,
                rightAnswers,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeMarkedAs(
                newStatus,
                currentAnswerStatus,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return true for right if answer status is acceptable', () => {
            const newStatus = 'right';
            const currentAnswerStatus = 'acceptable';
            const rightAnswers: string[] = ['truc'];
            const acceptableAnswers: string[] = ['chouette'];
            const question = {
                ...baseQuestion,
                rightAnswers,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeMarkedAs(
                newStatus,
                currentAnswerStatus,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for right if answer status is right', () => {
            const newStatus = 'right';
            const currentAnswerStatus = 'right';
            const rightAnswers: string[] = ['chouette'];
            const acceptableAnswers: string[] = ['machin'];
            const question = {
                ...baseQuestion,
                rightAnswers,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeMarkedAs(
                newStatus,
                currentAnswerStatus,
                question,
            );

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });
    });
});
