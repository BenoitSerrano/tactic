import { tableHandler } from './tableHandler';

describe('tableHandler', () => {
    describe('shift', () => {
        it('should not shift', () => {
            const initialTable = ['a', 'b', 'c', 'd', 'e'];
            const newTable = tableHandler.shift(initialTable, 3, 3);

            expect(newTable).toEqual(['a', 'b', 'c', 'd', 'e']);
        });
        it('should shift one element backward', () => {
            const initialTable = ['a', 'b', 'c', 'd', 'e'];
            const newTable = tableHandler.shift(initialTable, 4, 1);

            expect(newTable).toEqual(['a', 'e', 'b', 'c', 'd']);
        });

        it('should shift one element forward', () => {
            const initialTable = ['a', 'b', 'c', 'd', 'e'];
            const newTable = tableHandler.shift(initialTable, 1, 4);

            expect(newTable).toEqual(['a', 'c', 'd', 'e', 'b']);
        });
    });
});
