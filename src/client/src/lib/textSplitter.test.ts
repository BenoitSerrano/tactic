import { textSplitter } from './textSplitter';

describe('textSplitter', () => {
    it('should split words by spaces', () => {
        const text = 'tu es la plus belle';

        const words = textSplitter.split(text);

        expect(words).toEqual(['tu', 'es', 'la', 'plus', 'belle']);
    });
});
