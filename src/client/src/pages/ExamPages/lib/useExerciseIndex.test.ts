import { computeExerciseIndex } from './useExerciseIndex';

describe('useExerciseIndex', () => {
    describe('computeExerciseIndex', () => {
        it('should return undefined x 3 if no exercise', () => {
            const exercises: any[] = [];
            const hash = '#exercise-2';

            const exerciseIndexes = computeExerciseIndex(exercises, hash);

            expect(exerciseIndexes).toEqual({
                previous: undefined,
                current: undefined,
                next: undefined,
            });
        });
    });

    it('should return undefined, 0, 1 if no hash', () => {
        const exercises: any[] = ['premier', 'deuxième', 'troisième'];
        const hash = '';

        const exerciseIndexes = computeExerciseIndex(exercises, hash);

        expect(exerciseIndexes).toEqual({
            previous: undefined,
            current: 0,
            next: 1,
        });
    });

    it('should return undefined, 0, 1 if out of bound', () => {
        const exercises: any[] = ['premier', 'deuxième', 'troisième'];
        const hash = '#exercise-30';

        const exerciseIndexes = computeExerciseIndex(exercises, hash);

        expect(exerciseIndexes).toEqual({
            previous: undefined,
            current: 0,
            next: 1,
        });
    });

    it('should return undefined, 0, 1 if hash exercise-0', () => {
        const exercises: any[] = ['premier', 'deuxième', 'troisième'];
        const hash = '#exercise-0';

        const exerciseIndexes = computeExerciseIndex(exercises, hash);

        expect(exerciseIndexes).toEqual({
            previous: undefined,
            current: 0,
            next: 1,
        });
    });

    it('should return 0, 1, undefined if hash exercise-1 and no third', () => {
        const exercises: any[] = ['premier', 'deuxième'];
        const hash = '#exercise-1';

        const exerciseIndexes = computeExerciseIndex(exercises, hash);

        expect(exerciseIndexes).toEqual({
            previous: 0,
            current: 1,
            next: undefined,
        });
    });

    it('should return 0, 1, 2 if hash exercise-1 and enough exercises', () => {
        const exercises: any[] = ['premier', 'deuxième', 'troisième'];
        const hash = '#exercise-1';

        const exerciseIndexes = computeExerciseIndex(exercises, hash);

        expect(exerciseIndexes).toEqual({
            previous: 0,
            current: 1,
            next: 2,
        });
    });
});
