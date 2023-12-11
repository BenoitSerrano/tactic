import { extractMarks } from './extractMarks';

describe('extractMarks', () => {
    const baseExerciseWithAnswers = {
        id: 1,
        name: 'exercice',
        instruction: '',
        questions: [],
    };
    const baseQuestion = {
        title: 'truc',
        acceptableAnswersWithPoints: [] as string[],
        possibleAnswers: [] as string[],
        points: 10,
    };
    it('should compute automatic mark for qcm', () => {
        const question = {
            ...baseQuestion,
            id: 1,
            kind: 'qcm' as const,
            answer: '0',
            mark: 10,
        };
        const exercise = { ...baseExerciseWithAnswers, questions: [question] };

        const { automatic } = extractMarks([exercise]);

        expect(automatic[1]).toBe(10);
    });

    it('should compute manual mark for texteLibre', () => {
        const question = {
            ...baseQuestion,
            id: 1,
            kind: 'texteLibre' as const,
            answer: 'Youpi',
            mark: 10,
        };
        const exercise = { ...baseExerciseWithAnswers, questions: [question] };

        const { manual } = extractMarks([exercise]);

        expect(manual[1]).toBe(10);
    });

    it('should compute default manual mark for texteLibre empty', () => {
        const question = {
            ...baseQuestion,
            id: 1,
            kind: 'texteLibre' as const,
            answer: undefined,
            mark: undefined,
        };
        const exercise = { ...baseExerciseWithAnswers, questions: [question] };

        const { manual } = extractMarks([exercise]);

        expect(manual[1]).toBe(0);
    });

    it('should compute return undefined manual mark for texteLibre if not empty', () => {
        const question = {
            ...baseQuestion,
            id: 1,
            kind: 'texteLibre' as const,
            answer: 'une réponse',
            mark: undefined,
        };
        const exercise = { ...baseExerciseWithAnswers, questions: [question] };

        const { manual } = extractMarks([exercise]);

        expect(manual[1]).toBe(undefined);
    });
});
