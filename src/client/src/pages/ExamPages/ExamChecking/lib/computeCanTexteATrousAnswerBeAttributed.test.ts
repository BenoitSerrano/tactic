import { acceptableAnswerType, gradeType } from '../../../../types';
import { computeCanTexteATrousAnswerBeAttributed } from './computeCanTexteATrousAnswerBeAttributed';

describe('computeCanTexteATrousAnswerBeAttributed', () => {
    const baseQuestion = {
        id: 2,
        title: 'la vie .... belle, ne trouves-tu .... ?',
        kind: 'texteATrous' as const,
        answer: 'est|pas',
        points: 2,
        mark: undefined,
        acceptableAnswers: [
            [{ grade: 'A', answer: 'est' }],
            [
                { grade: 'A', answer: 'pas' },
                { grade: 'A', answer: 'point' },
            ],
        ] as acceptableAnswerType[][],
    };

    it('should return true for B if grade different from B', () => {
        const gradeToAttribute = 'B';
        const currentBlankGrade = 'A';
        const blankIndex = 1;

        const question = {
            ...baseQuestion,
        };

        const canAnswerBeMarkedAsAcceptable = computeCanTexteATrousAnswerBeAttributed(
            gradeToAttribute,
            currentBlankGrade,
            blankIndex,
            question,
        );

        expect(canAnswerBeMarkedAsAcceptable).toBe(true);
    });
});
