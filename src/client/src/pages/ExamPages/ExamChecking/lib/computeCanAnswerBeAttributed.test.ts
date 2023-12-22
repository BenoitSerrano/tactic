import { acceptableAnswerType, gradeType } from '../../../../types';
import { computeCanAnswerBeAttributed } from './computeCanAnswerBeAttributed';

describe('computeCanAnswerBeAttributed', () => {
    const baseQuestion = {
        id: 2,
        title: '',
        kind: 'questionReponse' as const,
        possibleAnswers: [],
        answer: 'chouette',
        points: 2,
    };
    describe('acceptable', () => {
        it('should return true for acceptable if answer status is wrong', () => {
            const newGrade = 'C';
            const grade = 'E';
            const acceptableAnswers = [
                { grade: 'A', answer: 'truc' },
                { grade: 'C', answer: 'bidule' },
            ] as acceptableAnswerType[];
            const question = {
                ...baseQuestion,
                grade: grade as gradeType,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for acceptable if answer is empty', () => {
            const newGrade = 'C';
            const grade = 'E';
            const acceptableAnswers = [
                { grade: 'A', answer: 'truc' },
                { grade: 'C', answer: 'bidule' },
            ] as acceptableAnswerType[];

            const question = {
                ...baseQuestion,
                answer: undefined,
                grade: grade as gradeType,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return false for acceptable if answer status is acceptable', () => {
            const newGrade = 'C';
            const grade = 'C';
            const acceptableAnswers = [
                { grade: 'A', answer: 'truc' },
                { grade: 'C', answer: 'bidule' },
            ] as acceptableAnswerType[];

            const question = {
                ...baseQuestion,
                grade: grade as gradeType,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return false for acceptable if answer status is right but it is the only right answer', () => {
            const newGrade = 'C';
            const grade = 'A';
            const acceptableAnswers = [
                { grade: 'A', answer: 'chouette' },
                { grade: 'C', answer: 'bidule' },
            ] as acceptableAnswerType[];

            const question = {
                ...baseQuestion,
                grade: grade as gradeType,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return true for acceptable if answer status is right and it has several right answers', () => {
            const newGrade = 'C';
            const grade = 'A';
            const acceptableAnswers = [
                { grade: 'A', answer: 'truc' },
                { grade: 'A', answer: 'chouette' },
                { grade: 'C', answer: 'bidule' },
            ] as acceptableAnswerType[];

            const question = {
                ...baseQuestion,
                grade: grade as gradeType,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });
    });
    describe('wrong', () => {
        it('should return true for wrong if answer status is acceptable', () => {
            const newGrade = 'E';
            const grade = 'C';
            const acceptableAnswers = [
                { grade: 'A', answer: 'truc' },
                { grade: 'C', answer: 'chouette' },
            ] as acceptableAnswerType[];

            const question = {
                ...baseQuestion,
                grade: grade as gradeType,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for wrong if answer status is wrong', () => {
            const newGrade = 'E';
            const grade = 'E';
            const acceptableAnswers = [{ grade: 'A', answer: 'truc' }] as acceptableAnswerType[];

            const question = {
                ...baseQuestion,
                grade: grade as gradeType,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        // it.only('should return false for wrong if mark is undefined', () => {
        //     const newGrade = "E";
        //     const mark = undefined;
        //     const answer = undefined;
        //     const acceptableAnswers: acceptableAnswerType[] = [];

        //     const question = {
        //         ...baseQuestion,
        //         answer,
        //         grade: grade as gradeType,
        //         acceptableAnswers,
        //     };

        //     const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);

        //     expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        // });

        it('should return false for wrong if answer is undefined or empty', () => {
            const newGrade = 'E';
            const grade = 'E';
            const answer = '';
            const acceptableAnswers: acceptableAnswerType[] = [{ grade: 'A', answer: 'truc' }];

            const question = {
                ...baseQuestion,
                grade: grade as gradeType,
                answer,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);
            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return false for wrong if answer status is right but it is the only right answer', () => {
            const newGrade = 'E';
            const grade = 'A';
            const acceptableAnswers = [
                { grade: 'A', answer: 'chouette' },
                { grade: 'C', answer: 'bidule' },
            ] as acceptableAnswerType[];

            const question = {
                ...baseQuestion,
                grade: grade as gradeType,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return true for wrong if answer status is right and it has several right answers', () => {
            const newGrade = 'E';
            const grade = 'A';
            const acceptableAnswers = [
                { grade: 'A', answer: 'truc' },
                { grade: 'A', answer: 'chouette' },
                { grade: 'C', answer: 'bidule' },
            ] as acceptableAnswerType[];

            const question = {
                ...baseQuestion,
                grade: grade as gradeType,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });
    });

    describe('right', () => {
        it('should return true for right if answer status is wrong', () => {
            const newGrade = 'A';
            const grade = 'E';
            const acceptableAnswers = [
                { grade: 'A', answer: 'truc' },
                { grade: 'C', answer: 'bidule' },
            ] as acceptableAnswerType[];

            const question = {
                ...baseQuestion,
                grade: grade as gradeType,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for right if answer status is wrong but answer is empty', () => {
            const newGrade = 'A';
            const grade = 'E';
            const acceptableAnswers = [
                { grade: 'A', answer: 'truc' },
                { grade: 'C', answer: 'bidule' },
            ] as acceptableAnswerType[];

            const question = {
                ...baseQuestion,
                answer: undefined,
                grade: grade as gradeType,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });

        it('should return true for right if answer status is acceptable', () => {
            const newGrade = 'A';
            const grade = 'C';
            const acceptableAnswers = [
                { grade: 'A', answer: 'truc' },
                { grade: 'C', answer: 'chouette' },
            ] as acceptableAnswerType[];

            const question = {
                ...baseQuestion,
                grade: grade as gradeType,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(true);
        });

        it('should return false for right if answer status is right', () => {
            const newGrade = 'A';
            const grade = 'A';
            const acceptableAnswers = [
                { grade: 'A', answer: 'chouette' },
                { grade: 'C', answer: 'machin' },
            ] as acceptableAnswerType[];

            const question = {
                ...baseQuestion,
                grade: grade as gradeType,
                acceptableAnswers,
            };

            const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(newGrade, question);

            expect(canAnswerBeMarkedAsAcceptable).toBe(false);
        });
    });
});
