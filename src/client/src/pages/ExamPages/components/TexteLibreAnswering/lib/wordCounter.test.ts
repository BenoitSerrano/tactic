import { wordCounter } from './wordCounter';

describe('wordCounter', () => {
    it('should return 0 if empty', () => {
        const text = '';

        const wordCount = wordCounter.count(text);

        expect(wordCount).toBe(0);
    });

    it('should return 0 if only spaces', () => {
        const text = '      ';

        const wordCount = wordCounter.count(text);

        expect(wordCount).toBe(0);
    });

    it('should return 1', () => {
        const text = 'truc';

        const wordCount = wordCounter.count(text);

        expect(wordCount).toBe(1);
    });

    it('should return 5', () => {
        const text = 'La vie. La vraie vie.';

        const wordCount = wordCounter.count(text);

        expect(wordCount).toBe(5);
    });

    it('should return 4', () => {
        const text = "J'ai bien mangé";

        const wordCount = wordCounter.count(text);

        expect(wordCount).toBe(4);
    });

    it('should return 6', () => {
        const text = "J'ai bien mangé ! Et toi  ?";

        const wordCount = wordCounter.count(text);

        expect(wordCount).toBe(6);
    });
});
