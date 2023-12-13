import { FLOATING_NUMBER_REGEX } from './constants';

describe('constants', () => {
    describe('FLOATING_NUMBER_REGEX', () => {
        it('should accept integer', () => {
            const value = '10';

            const match = value.match(FLOATING_NUMBER_REGEX);

            expect(match).not.toBe(null);
        });

        it('should accept floating number', () => {
            const value = '100.5';

            const match = value.match(FLOATING_NUMBER_REGEX);

            expect(match).not.toBe(null);
        });

        it.only('should accept partial floatting number', () => {
            const value = '10.';

            const match = value.match(FLOATING_NUMBER_REGEX);
            console.log(match);
            expect(match).not.toBe(null);
        });
    });
});
