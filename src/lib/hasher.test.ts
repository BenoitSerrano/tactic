import { hasher } from './hasher';
import crypto from 'crypto';

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
});
