import { computeShuffledAnswerState } from './computeShuffledAnswerState';

describe('computeShuffledAnswerState', () => {
    const initialWords = ['es', 'plus', 'belle', 'tu', 'la'];

    it('should handle when combination is empty', () => {
        const combination: number[] = [];

        const shuffledAnswerState = computeShuffledAnswerState(initialWords, combination);

        expect(shuffledAnswerState).toEqual({
            remainingWordIndexesToPlace: [0, 1, 2, 3, 4],
            alreadyPlacedWords: [],
        });
    });

    it('should handle when combination is partial', () => {
        const combination: number[] = [3, 0, 4, 1, 2];

        const shuffledAnswerState = computeShuffledAnswerState(initialWords, combination);

        expect(shuffledAnswerState).toEqual({
            remainingWordIndexesToPlace: [],
            alreadyPlacedWords: ['tu', 'es', 'la', 'plus', 'belle'],
        });
    });
});
