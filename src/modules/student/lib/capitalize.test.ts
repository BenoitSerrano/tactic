import { capitalize } from './capitalize';

describe('capitalize', () => {
    it('should return empty if passed empty', () => {
        expect(capitalize('')).toBe('');
    });

    it('should capitalize the first letter of a string', () => {
        expect(capitalize('thomas')).toBe('Thomas');
    });

    it('should capitalize all the first letters of the words when hyphened', () => {
        expect(capitalize('jean-bernard')).toBe('Jean-Bernard');
    });

    it('should capitalize all the first letters of the words when hyphened', () => {
        expect(capitalize('jean bernard')).toBe('Jean Bernard');
    });
});
