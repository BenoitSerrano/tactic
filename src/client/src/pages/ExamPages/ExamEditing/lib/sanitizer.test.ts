import { sanitizer } from './sanitizer';

describe('sanitizer', () => {
    describe('sanitize', () => {
        it('should get rid of multilines', () => {
            const value = `start
            end`;

            const sanitized = sanitizer.sanitize(value);

            expect(sanitized).toBe('start end');
        });
    });
});
