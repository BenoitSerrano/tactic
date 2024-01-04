import {
    mergeAdjacentBlanks,
    computeRightAnswerIndex,
    computeTexteATrousState,
} from './computeTexteATrousState';

describe('computeTexteATrousState', () => {
    // "tu es vraiment la plus belle"
    it('computes for a virgin state', () => {
        const wordIndex = 1;
        const prevTitle = 'tu es vraiment la plus belle';
        const prevRightAnswers: string[] = [];

        const nextState = computeTexteATrousState(wordIndex, {
            title: prevTitle,
            rightAnswers: prevRightAnswers,
        });

        expect(nextState.title).toBe('tu .... vraiment la plus belle');
        expect(nextState.rightAnswers).toEqual(['es']);
    });

    it('computes back for one missing word', () => {
        const wordIndex = 1;
        const prevTitle = 'tu .... vraiment la plus belle';
        const prevRightAnswers: string[] = ['es'];

        const nextState = computeTexteATrousState(wordIndex, {
            title: prevTitle,
            rightAnswers: prevRightAnswers,
        });

        expect(nextState.title).toBe('tu es vraiment la plus belle');
        expect(nextState.rightAnswers).toEqual([]);
    });

    it('computes back for one missing word among three', () => {
        const wordIndex = 3;
        const prevTitle = 'tu .... vraiment .... plus ....';
        const prevRightAnswers: string[] = ['es', 'la', 'belle'];

        const nextState = computeTexteATrousState(wordIndex, {
            title: prevTitle,
            rightAnswers: prevRightAnswers,
        });

        expect(nextState.title).toBe('tu .... vraiment la plus ....');
        expect(nextState.rightAnswers).toEqual(['es', 'belle']);
    });

    it('computes for a state that has one missing word', () => {
        const wordIndex = 3;
        const prevTitle = 'tu .... vraiment la plus belle';
        const prevRightAnswers: string[] = ['es'];

        const nextState = computeTexteATrousState(wordIndex, {
            title: prevTitle,
            rightAnswers: prevRightAnswers,
        });

        expect(nextState.title).toBe('tu .... vraiment .... plus belle');
        expect(nextState.rightAnswers).toEqual(['es', 'la']);
    });

    it('computes for a state that has two missing words', () => {
        const wordIndex = 2;
        const prevTitle = 'tu .... vraiment .... plus belle';
        const prevRightAnswers: string[] = ['es', 'la'];

        const nextState = computeTexteATrousState(wordIndex, {
            title: prevTitle,
            rightAnswers: prevRightAnswers,
        });

        expect(nextState.title).toBe('tu .... plus belle');
        expect(nextState.rightAnswers).toEqual(['es vraiment la']);
    });

    it('computes for one missing word adjacent', () => {
        const wordIndex = 2;
        const prevTitle = 'tu .... vraiment la plus belle';
        const prevRightAnswers: string[] = ['es'];

        const nextState = computeTexteATrousState(wordIndex, {
            title: prevTitle,
            rightAnswers: prevRightAnswers,
        });

        expect(nextState.title).toBe('tu .... la plus belle');
        expect(nextState.rightAnswers).toEqual(['es vraiment']);
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
    describe('mergeAdjacentBlanks', () => {
        it('should return same state if no adjacent blanks', () => {
            const title = 'tu .... vraiment .... plus belle';
            const rightAnswers = ['es', 'la'];

            const nextState = mergeAdjacentBlanks({ title, rightAnswers });

            expect(nextState.title).toBe(title);
            expect(nextState.rightAnswers).toEqual(rightAnswers);
        });
        it('should return merged state if one adjacent blank', () => {
            const title = 'tu .... .... la plus belle';
            const rightAnswers = ['es', 'vraiment'];

            const nextState = mergeAdjacentBlanks({ title, rightAnswers });

            expect(nextState.title).toBe('tu .... la plus belle');
            expect(nextState.rightAnswers).toEqual(['es vraiment']);
        });
        it('should return merged state if two adjacent blanks at the end', () => {
            const title = 'tu est vraiment la .... ....';
            const rightAnswers = ['plus', 'belle'];

            const nextState = mergeAdjacentBlanks({ title, rightAnswers });

            expect(nextState.title).toBe('tu est vraiment la ....');
            expect(nextState.rightAnswers).toEqual(['plus belle']);
        });
    });
});
