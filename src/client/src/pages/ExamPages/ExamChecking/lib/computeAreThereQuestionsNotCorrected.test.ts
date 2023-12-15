import { manualMarksType } from '../../lib/extractMarks';
import { exerciseWithAnswersType } from '../../types';
import { computeAreThereQuestionsNotCorrected } from './computeAreThereQuestionsNotCorrected';

describe('computeAreThereQuestionsNotCorrected', () => {
    const baseExercise = { id: 1, instruction: '', name: '' };
    const baseQuestion = {
        kind: 'texteLibre' as const,
        title: '',
        possibleAnswers: [],
        points: 6,
        acceptableAnswersWithPoints: [],
    };
    it('should return false if there is no manual marks', () => {
        const manualMarks: manualMarksType = {};
        const exercises: exerciseWithAnswersType[] = [];

        const areThereQuestionsNotCorrected = computeAreThereQuestionsNotCorrected(
            exercises,
            manualMarks,
        );

        expect(areThereQuestionsNotCorrected).toBe(false);
    });

    it('should return false if all manual marks are defined', () => {
        const manualMarks: manualMarksType = { 2: 2, 3: 3 };
        const exercises: exerciseWithAnswersType[] = [
            {
                ...baseExercise,
                questions: [
                    { ...baseQuestion, id: 2, mark: 2, answer: 'truc' },
                    { ...baseQuestion, id: 3, mark: 3, answer: 'bidule' },
                ],
            },
        ];

        const areThereQuestionsNotCorrected = computeAreThereQuestionsNotCorrected(
            exercises,
            manualMarks,
        );

        expect(areThereQuestionsNotCorrected).toBe(false);
    });

    it('should return true if one manual marks is not defined', () => {
        const manualMarks: manualMarksType = { 2: 2, 3: undefined };
        const exercises: exerciseWithAnswersType[] = [
            {
                ...baseExercise,
                questions: [
                    { ...baseQuestion, id: 2, mark: 2, answer: 'truc' },
                    { ...baseQuestion, id: 3, mark: undefined, answer: 'bidule' },
                ],
            },
        ];

        const areThereQuestionsNotCorrected = computeAreThereQuestionsNotCorrected(
            exercises,
            manualMarks,
        );

        expect(areThereQuestionsNotCorrected).toBe(true);
    });

    it('should return false if one manual mark is not defined but the answer is falsy', () => {
        const manualMarks: manualMarksType = { 2: 2, 3: undefined };
        const exercises: exerciseWithAnswersType[] = [
            {
                ...baseExercise,
                questions: [
                    { ...baseQuestion, id: 2, mark: 2, answer: 'truc' },
                    { ...baseQuestion, id: 3, mark: undefined, answer: '' },
                ],
            },
        ];

        const areThereQuestionsNotCorrected = computeAreThereQuestionsNotCorrected(
            exercises,
            manualMarks,
        );

        expect(areThereQuestionsNotCorrected).toBe(false);
    });
});
