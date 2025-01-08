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

        it('should return the route path with query parameters', () => {
            const path = pathHandler.getRoutePath(
                'RESET_PASSWORD',
                {},
                { resetPasswordRequestId: 'machin', bidule: 'chouette' },
            );

            expect(path).toBe('/reset-password?resetPasswordRequestId=machin&bidule=chouette');
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

    describe('extractParameters', () => {
        it('should return path with no parameter if path has no parameter', () => {
            const path = pathHandler.getRoutePath('RESET_PASSWORD_FAILURE');

            const parsedPath = pathHandler.parsePath(path);

            expect(parsedPath?.routeKey).toEqual('RESET_PASSWORD_FAILURE');
            expect(parsedPath?.parameters).toEqual({});
        });

        it('should return home if path is home', () => {
            const path = pathHandler.getRoutePath('HOME');

            const parsedPath = pathHandler.parsePath(path);

            expect(parsedPath?.routeKey).toEqual('HOME');
            expect(parsedPath?.parameters).toEqual({});
        });

        it('should return path with parameter if path has one parameter', () => {
            const examId = `${Math.floor(Math.random() * 10000) + 1}`;
            const classeId = `${Math.floor(Math.random() * 10000) + 1}`;
            const establishmentId = `${Math.floor(Math.random() * 10000) + 1}`;
            const path = pathHandler.getRoutePath('EXAM_EDITING_CONTENT', {
                examId,
                classeId,
                establishmentId,
            });

            const parsedPath = pathHandler.parsePath(path);

            expect(parsedPath?.routeKey).toEqual('EXAM_EDITING_CONTENT');
            expect(parsedPath?.parameters).toEqual({ examId, classeId, establishmentId });
        });

        it('should return path with several parameters if path has several parameters', () => {
            const studentId = `${Math.floor(Math.random() * 10000) + 1}`;
            const attemptId = `${Math.floor(Math.random() * 10000) + 1}`;
            const path = pathHandler.getRoutePath('EXAM_CONSULTING', { studentId, attemptId });

            const parsedPath = pathHandler.parsePath(path);

            expect(parsedPath?.routeKey).toEqual('EXAM_CONSULTING');
            expect(parsedPath?.parameters).toEqual({ studentId, attemptId });
        });
    });
});
