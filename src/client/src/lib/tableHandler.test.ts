import { tableHandler } from './tableHandler';

describe('tableHandler', () => {
    describe('swap', () => {
        it('should swap the two elements', () => {
            const initialTable = ['a', 'b', 'c', 'd', 'e'];
            const newTable = tableHandler.swap(initialTable, 1, 3);

            expect(newTable).toEqual(['a', 'd', 'c', 'b', 'e']);
        });
    });
});
