import { sanitizer } from './sanitizer';

describe('sanitizer', () => {
    it('should return true if space before point', () => {
        const answer1 = "je suis j'aime aller à bordeaux verger port de rafiel habite";
        const answer2 = 'Je suis j’aime aller à bordeaux verger port de rafiel habite .';

        expect(sanitizer.sanitizeString(answer1)).toEqual(sanitizer.sanitizeString(answer2));
    });

    it('should return true if several points', () => {
        const answer1 = 'je suis .....';
        const answer2 = 'je suis ..';

        expect(sanitizer.sanitizeString(answer1)).toEqual(sanitizer.sanitizeString(answer2));
    });

    it('should return true if different guillemets', () => {
        const answer1 = `je suis « Benoit »`;
        const answer2 = `je suis “Benoit”`;

        expect(sanitizer.sanitizeString(answer1)).toEqual(sanitizer.sanitizeString(answer2));
    });
});
