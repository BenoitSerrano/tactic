import { computeAttemptIdNeighbours } from './computeAttemptIdNeighbours';

describe('computeAttemptIdNeighbours', () => {
    const attemptId = 'BIDULE';

    it('should return undefined for both neightbours if only one attemptId', () => {
        const attemptIds = ['BIDULE'];

        const { previous, next } = computeAttemptIdNeighbours(attemptId, attemptIds);

        expect(previous).toBe(undefined);
        expect(next).toBe(undefined);
    });

    it('should return undefined for left neightbour if left extremity reached', () => {
        const attemptIds = ['BIDULE', 'MACHIN'];

        const { previous, next } = computeAttemptIdNeighbours(attemptId, attemptIds);

        expect(previous).toBe(undefined);
        expect(next).toBe('MACHIN');
    });

    it('should return both neighbours if middle', () => {
        const attemptIds = ['MACHIN', 'BIDULE', 'CHOUETTE'];

        const { previous, next } = computeAttemptIdNeighbours(attemptId, attemptIds);

        expect(previous).toBe('MACHIN');
        expect(next).toBe('CHOUETTE');
    });
});
