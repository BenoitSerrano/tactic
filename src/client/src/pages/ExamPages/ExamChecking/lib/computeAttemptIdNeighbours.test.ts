import { computeAttemptIdNeighbours } from './computeAttemptIdNeighbours';

describe('computeAttemptIdNeighbours', () => {
    const attemptId = 'BIDULE';

    it('should return undefined for both neightbours if only one attemptId', () => {
        const attemptIds = ['BIDULE'];
        const searchAttemptIds = attemptIds.join(',');

        const { previous, next } = computeAttemptIdNeighbours(attemptId, searchAttemptIds);

        expect(previous).toBe(undefined);
        expect(next).toBe(undefined);
    });

    it('should return undefined for left neightbour if left extremity reached', () => {
        const attemptIds = ['BIDULE', 'MACHIN'];
        const searchAttemptIds = attemptIds.join(',');

        const { previous, next } = computeAttemptIdNeighbours(attemptId, searchAttemptIds);

        expect(previous).toBe(undefined);
        expect(next).toBe('MACHIN');
    });

    it('should return both neighbours if middle', () => {
        const attemptIds = ['MACHIN', 'BIDULE', 'CHOUETTE'];
        const searchAttemptIds = attemptIds.join(',');

        const { previous, next } = computeAttemptIdNeighbours(attemptId, searchAttemptIds);

        expect(previous).toBe('MACHIN');
        expect(next).toBe('CHOUETTE');
    });
});
