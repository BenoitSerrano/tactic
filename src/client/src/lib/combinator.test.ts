import { combinator } from './combinator';

describe('combinator', () => {
    const count = 100;
    const identity = combinator.generateIdentity(count);
    describe('generate', () => {
        it('should generate a combination that is not identity', () => {
            const combination = combinator.generate(count);

            expect(combination.length).toEqual(count);
            expect(combination).not.toEqual(identity);
            combination.sort((a, b) => a - b);
            expect(combination).toEqual(identity);
        });
    });

    describe('generateIdentity', () => {
        it('should generate the identity combination', () => {
            const combination = combinator.generateIdentity(5);

            expect(combination).toEqual([0, 1, 2, 3, 4]);
        });
    });
});
