import { pathHandler } from './pathHandler';

describe('pathHandler', () => {
    describe('extractCurrentAttemptId', () => {
        it('should return the attempt id', () => {
            const pathname =
                '/student/students/219a36c4-a04e-4877-b300-000a27c0830f/attempts/c2ac2fac-0519-4659-856c-b27e3570746d';

            const currentAttemptId = pathHandler.extractCurrentAttemptId(pathname);

            expect(currentAttemptId).toBe('c2ac2fac-0519-4659-856c-b27e3570746d');
        });
    });
});
