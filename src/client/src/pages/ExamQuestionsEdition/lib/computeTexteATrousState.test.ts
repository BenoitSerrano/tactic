import { computeRightAnswerIndex, computeTexteATrousState } from './computeTexteATrousState';

describe('computeTexteATrousState', () => {
    // "tu es vraiment la plus belle"
    it('computes for a virgin state', () => {
        const wordIndex = 1;
        const prevTitle = 'tu es vraiment la plus belle';
        const prevRightAnswers: string[] = [];

        const { nextTitle, nextRightAnswers } = computeTexteATrousState(wordIndex, {
            prevTitle,
            prevRightAnswers,
        });

        expect(nextTitle).toBe('tu .... vraiment la plus belle');
        expect(nextRightAnswers).toEqual(['es']);
    });

    it('computes for a state that has one missing word', () => {
        const wordIndex = 3;
        const prevTitle = 'tu .... vraiment la plus belle';
        const prevRightAnswers: string[] = ['es'];

        const { nextTitle, nextRightAnswers } = computeTexteATrousState(wordIndex, {
            prevTitle,
            prevRightAnswers,
        });

        expect(nextTitle).toBe('tu .... vraiment .... plus belle');
        expect(nextRightAnswers).toEqual(['es', 'la']);
    });

    it('computes for a state that has two missing words', () => {
        const wordIndex = 2;
        const prevTitle = 'tu .... vraiment .... plus belle';
        const prevRightAnswers: string[] = ['es', 'la'];

        const { nextTitle, nextRightAnswers } = computeTexteATrousState(wordIndex, {
            prevTitle,
            prevRightAnswers,
        });

        expect(nextTitle).toBe('tu .... .... .... plus belle');
        expect(nextRightAnswers).toEqual(['es', 'vraiment', 'la']);
    });

    describe('computeRightAnswerIndex', () => {
        it('should be right for new insertion', () => {
            const wordIndex = 2;
            const prevTitle = 'tu es vraiment la plus belle';

            const rightAnswerIndex = computeRightAnswerIndex(wordIndex, prevTitle);

            expect(rightAnswerIndex).toBe(0);
        });

        it('should be right for second insertion', () => {
            const wordIndex = 2;
            const prevTitle = 'tu .... vraiment la plus belle';

            const rightAnswerIndex = computeRightAnswerIndex(wordIndex, prevTitle);

            expect(rightAnswerIndex).toBe(1);
        });

        it('should be right for insertion in the middle', () => {
            const wordIndex = 2;
            const prevTitle = 'tu .... vraiment .... plus belle';

            const rightAnswerIndex = computeRightAnswerIndex(wordIndex, prevTitle);

            expect(rightAnswerIndex).toBe(1);
        });

        it('should be right for insertion at the end', () => {
            const wordIndex = 5;
            const prevTitle = 'tu .... vraiment .... plus belle';

            const rightAnswerIndex = computeRightAnswerIndex(wordIndex, prevTitle);

            expect(rightAnswerIndex).toBe(2);
        });
    });
});
