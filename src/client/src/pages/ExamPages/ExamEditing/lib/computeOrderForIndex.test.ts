import { computeOrderForIndex } from './computeOrderForIndex';

describe('computeOrderForIndex', () => {
    it('should return 0 if no entity', () => {
        const entities: Array<{ order: number }> = [];
        const currentEntityIndex = -1;

        const order = computeOrderForIndex(currentEntityIndex, entities);

        expect(order).toBe(0);
    });

    it('should return order [0] - 1 if only one entity and before', () => {
        const entities = [{ order: 10 }];
        const currentEntityIndex = -1;

        const order = computeOrderForIndex(currentEntityIndex, entities);

        expect(order).toBe(9);
    });

    it('should return order [0] + 1 if only one entity and after', () => {
        const entities = [{ order: 10 }];
        const currentEntityIndex = 0;

        const order = computeOrderForIndex(currentEntityIndex, entities);

        expect(order).toBe(11);
    });

    it('should return order ([i] + [i+1])/2 if between two entities', () => {
        const entities = [{ order: 10 }, { order: 20 }];
        const currentEntityIndex = 0;

        const order = computeOrderForIndex(currentEntityIndex, entities);

        expect(order).toBe(15);
    });
});
