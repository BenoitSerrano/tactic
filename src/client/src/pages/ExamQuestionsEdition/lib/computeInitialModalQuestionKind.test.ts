import { computeInitialModalQuestionKind } from './computeInitialModalQuestionKind';

describe('computeInitialModalQuestionKind', () => {
    it('should return the exercise default question kind if modal is creating', () => {
        const modalStatus = { kind: 'creating' as const };
        const defaultQuestionKind = 'texteLibre';

        const initialModalQuestionKind = computeInitialModalQuestionKind(
            modalStatus,
            defaultQuestionKind,
        );

        expect(initialModalQuestionKind).toBe('texteLibre');
    });
    it('should return the edited question kind if modal is editing', () => {
        const questionWithAnswers = {
            id: 1,
            kind: 'qcm' as const,
            title: 'title',
            points: 2,
            acceptableAnswersWithPoints: [{ points: 2, answer: '2' }],
            possibleAnswers: ['bleu', 'vert', 'jaune', 'gris'],
        };
        const modalStatus = { kind: 'editing' as const, question: questionWithAnswers };
        const defaultQuestionKind = 'texteLibre';

        const initialModalQuestionKind = computeInitialModalQuestionKind(
            modalStatus,
            defaultQuestionKind,
        );

        expect(initialModalQuestionKind).toBe('qcm');
    });
});
