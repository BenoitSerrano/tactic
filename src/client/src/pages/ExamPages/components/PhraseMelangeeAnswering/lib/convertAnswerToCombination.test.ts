import { convertAnswerToCombination } from './convertAnswerToCombination';

describe('convertAnswerToCombination', () => {
    it('should return one combination that fits the answer for a partial answer', () => {
        const answer = 'la vie est';
        const initialWords = ['belle', 'est', 'vie', 'la'];

        const combination = convertAnswerToCombination(initialWords, answer);

        expect(combination).toEqual([3, 2, 1]);
    });

    it('should return one combination that fits the answer even if two words are equal', () => {
        const answer = 'la vie est la';
        const initialWords = ['la', 'est', 'vie', 'la'];

        const combination = convertAnswerToCombination(initialWords, answer);

        const reassembledAnswer = combination.map((wordIndex) => initialWords[wordIndex]).join(' ');

        expect(reassembledAnswer).toEqual(answer);
        expect([...combination].sort()).toEqual([0, 1, 2, 3]);
    });

    it('should return one combination that fits the answer for a total answer', () => {
        const answer = 'la vie est belle';
        const initialWords = ['belle', 'est', 'vie', 'la'];

        const combination = convertAnswerToCombination(initialWords, answer);

        expect(combination).toEqual([3, 2, 1, 0]);
    });
});
