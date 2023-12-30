import { computeExerciseProgress } from './computeExerciseProgress';

describe('computeExerciseProgress', () => {
    it('should return 0 if no questions', () => {
        const questions: any[] = [];
        const attemptAnswers = {};

        const progress = computeExerciseProgress(questions, attemptAnswers);

        expect(progress).toBe(0);
    });
    it('should compute exerciseProgress for questions non tàt', () => {
        const questions = [
            { id: 1, kind: 'qcm' as const, title: '' },
            { id: 2, kind: 'qcm' as const, title: '' },
        ];
        const attemptAnswers = { 1: '0' };

        const progress = computeExerciseProgress(questions, attemptAnswers);

        expect(progress).toBe(0.5);
    });

    it('should compute exerciseProgress for tàt', () => {
        const questions = [
            {
                id: 1,
                kind: 'texteATrous' as const,
                title: "la .... est .... mais la .... l'est ....",
            },
        ];
        const attemptAnswers = { 1: 'vie||mort|plus' };

        const progress = computeExerciseProgress(questions, attemptAnswers);

        expect(progress).toBe(0.75);
    });

    it('should compute exerciseProgress for tàt and a qcm', () => {
        const questions = [
            {
                id: 1,
                kind: 'texteATrous' as const,
                title: "la .... est .... mais la .... l'est ....",
            },
            { id: 2, kind: 'qcm' as const, title: '' },
        ];
        const attemptAnswers = { 1: 'vie||mort|plus', 2: '2' };

        const progress = computeExerciseProgress(questions, attemptAnswers);

        expect(progress).toBe(0.8);
    });

    it('should compute exerciseProgress for empty tàt and a qcm', () => {
        const questions = [
            {
                id: 1,
                kind: 'texteATrous' as const,
                title: "la .... est .... mais la .... l'est ....",
            },
            { id: 2, kind: 'qcm' as const, title: '' },
        ];
        const attemptAnswers = { 1: '', 2: '2' };

        const progress = computeExerciseProgress(questions, attemptAnswers);

        expect(progress).toBe(0.2);
    });
});
