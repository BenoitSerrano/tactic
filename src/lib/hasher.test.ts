import { hasher } from './hasher';

describe('hasher', () => {
    it('should hash the value', () => {
        const value1 = 'Une valeur spécifique';
        const value2 = 'Une autre valeur moins spécifique';

        const hash1 = hasher.hash(value1);
        const hash2 = hasher.hash(value2);

        expect(hash1.length).toBe(64);
        expect(hash2.length).toBe(64);
        expect(hash1).not.toBe(hash2);
    });

    it('should verify if the hashed value matches', () => {
        const value = 'Une valeur spécifique';

        const result = hasher.verify(
            value,
            '965b177fb1578f60619081fa749285fae80ac3b3efeb212a55dcbb34204af612',
        );

        expect(result).toBe(true);
    });
});
