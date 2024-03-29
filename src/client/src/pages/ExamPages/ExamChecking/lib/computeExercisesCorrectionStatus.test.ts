import { exerciseWithAnswersType } from '../../types';
import { computeExercisesCorrectionStatus } from './computeExercisesCorrectionStatus';

describe('computeExercisesCorrectionStatus', () => {
    const baseExercise = { id: 1, instruction: '', name: '' };
    const baseQuestion = {
        kind: 'texteLibre' as const,
        title: '',
        possibleAnswers: [],
        points: 4,
        acceptableAnswers: [],
    };
    it('should return false if there is no manual grades', () => {
        const exercises: exerciseWithAnswersType[] = [];

        const exercisesCorrectionStatus = computeExercisesCorrectionStatus(exercises);

        expect(exercisesCorrectionStatus.isCorrectionDone).toBe(true);
    });

    it('should return false if all manual grades are defined', () => {
        const exercises: exerciseWithAnswersType[] = [
            {
                ...baseExercise,
                questions: [
                    { ...baseQuestion, id: 2, mark: 0, answer: 'truc' },
                    { ...baseQuestion, id: 3, mark: 2, answer: 'bidule' },
                ],
            },
        ];

        const exercisesCorrectionStatus = computeExercisesCorrectionStatus(exercises);

        expect(exercisesCorrectionStatus.isCorrectionDone).toBe(true);
    });

    it('should return true if one manual grades is not defined', () => {
        const exercises: exerciseWithAnswersType[] = [
            {
                ...baseExercise,
                questions: [
                    { ...baseQuestion, id: 2, mark: 1, answer: 'truc' },
                    { ...baseQuestion, id: 3, mark: undefined, answer: 'bidule' },
                ],
            },
        ];

        const exercisesCorrectionStatus = computeExercisesCorrectionStatus(exercises);

        expect(exercisesCorrectionStatus.isCorrectionDone).toBe(false);
    });

    it('should return false if one manual grade is not defined but the answer is falsy', () => {
        const exercises: exerciseWithAnswersType[] = [
            {
                ...baseExercise,
                questions: [
                    { ...baseQuestion, id: 2, mark: 1, answer: 'truc' },
                    { ...baseQuestion, id: 3, mark: undefined as any, answer: '' },
                ],
            },
        ];

        const exercisesCorrectionStatus = computeExercisesCorrectionStatus(exercises);

        expect(exercisesCorrectionStatus.isCorrectionDone).toBe(true);
    });
});
