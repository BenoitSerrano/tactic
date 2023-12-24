import { sanitizer } from './sanitizer';

describe('sanitizer', () => {
    it('should return true if space before point', () => {
        const answer1 = "je suis j'aime aller à bordeaux verger port de rafiel habite";
        const answer2 = 'Je suis j’aime aller à bordeaux verger port de rafiel habite .';

        expect(sanitizer.sanitizeString(answer1)).toEqual(sanitizer.sanitizeString(answer2));
    });
});
