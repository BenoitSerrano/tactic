import { exerciseWithAnswersType } from '../../types';
import { computeAreThereQuestionsNotCorrected } from './computeAreThereQuestionsNotCorrected';

describe('computeAreThereQuestionsNotCorrected', () => {
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

        const areThereQuestionsNotCorrected = computeAreThereQuestionsNotCorrected(exercises);

        expect(areThereQuestionsNotCorrected).toBe(false);
    });

    it('should return false if all manual grades are defined', () => {
        const exercises: exerciseWithAnswersType[] = [
            {
                ...baseExercise,
                questions: [
                    { ...baseQuestion, id: 2, grade: 'D', answer: 'truc' },
                    { ...baseQuestion, id: 3, grade: 'C', answer: 'bidule' },
                ],
            },
        ];

        const areThereQuestionsNotCorrected = computeAreThereQuestionsNotCorrected(exercises);

        expect(areThereQuestionsNotCorrected).toBe(false);
    });

    it('should return true if one manual grades is not defined', () => {
        const exercises: exerciseWithAnswersType[] = [
            {
                ...baseExercise,
                questions: [
                    { ...baseQuestion, id: 2, grade: 'D', answer: 'truc' },
                    { ...baseQuestion, id: 3, grade: undefined as any, answer: 'bidule' },
                ],
            },
        ];

        const areThereQuestionsNotCorrected = computeAreThereQuestionsNotCorrected(exercises);

        expect(areThereQuestionsNotCorrected).toBe(true);
    });

    it('should return false if one manual grade is not defined but the answer is falsy', () => {
        const exercises: exerciseWithAnswersType[] = [
            {
                ...baseExercise,
                questions: [
                    { ...baseQuestion, id: 2, grade: 'D', answer: 'truc' },
                    { ...baseQuestion, id: 3, grade: undefined as any, answer: '' },
                ],
            },
        ];

        const areThereQuestionsNotCorrected = computeAreThereQuestionsNotCorrected(exercises);

        expect(areThereQuestionsNotCorrected).toBe(false);
    });
});
