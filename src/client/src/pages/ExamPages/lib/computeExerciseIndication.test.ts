import { computeExerciseIndication } from './computeExerciseIndication';

describe('computeExerciseIndication', () => {
    describe('result', () => {
        it('should display exercise result if question have marks', () => {
            const exercise = {
                questions: [
                    { points: 2, mark: 2 },
                    { points: 3, mark: undefined },
                ],
            };

            const exerciseResult = computeExerciseIndication(exercise);

            expect(exerciseResult).toBe('2 / 5');
        });

        it('should display exercise result if question have no marks', () => {
            const exercise = {
                questions: [{ points: 2 }, { points: 3 }],
            };

            const exerciseResult = computeExerciseIndication(exercise);

            expect(exerciseResult).toBe('0 / 5');
        });

        it('should not display exercise mark if hidden', () => {
            const exercise = {
                questions: [{ points: 2 }, { points: 3 }],
            };

            const exerciseResult = computeExerciseIndication(exercise, {
                hideMark: true,
            });

            expect(exerciseResult).toBe('/ 5');
        });
    });
});
