import { pathHandler } from './pathHandler';

describe('pathHandler', () => {
    describe('getRoutePath', () => {
        it('should return the generic route path if no parameters provided', () => {
            const path = pathHandler.getRoutePath('SIGN_IN');

            expect(path).toBe('/sign-in');
        });

        it('should return the route path with parameters', () => {
            const path = pathHandler.getRoutePath('EXAM_TAKING', {
                studentId: '219a36c4-a04e-4877-b300-000a27c0830f',
                attemptId: 'c2ac2fac-0519-4659-856c-b27e3570746d',
            });

            expect(path).toBe(
                '/student/students/219a36c4-a04e-4877-b300-000a27c0830f/attempts/c2ac2fac-0519-4659-856c-b27e3570746d/take',
            );
        });

        it('should return the route path with parameters and query parameters', () => {
            const path = pathHandler.getRoutePath(
                'STUDENT_AUTHENTICATION',
                {
                    examId: 'examId1',
                },
                { truc: 'machin', bidule: 'chouette' },
            );

            expect(path).toBe('/student/exams/examId1?truc=machin&bidule=chouette');
        });
    });

    describe('extractCurrentAttemptId', () => {
        it('should return the attempt id', () => {
            const pathname = pathHandler.getRoutePath('EXAM_TAKING', {
                studentId: '219a36c4-a04e-4877-b300-000a27c0830f',
                attemptId: 'c2ac2fac-0519-4659-856c-b27e3570746d',
            });

            const currentAttemptId = pathHandler.extractCurrentAttemptId(pathname);

            expect(currentAttemptId).toBe('c2ac2fac-0519-4659-856c-b27e3570746d');
        });
    });
});
