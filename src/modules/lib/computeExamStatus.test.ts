import { Attempt } from '../attempt';
import { computeExamStatus } from './computeExamStatus';

describe('computeExamStatus', () => {
    const now = new Date('2023-07-24 07:37:20.429 +0200');
    const duration = 60;
    const extraTime = 5;
    const exam = { id: 'exam1', name: 'Exam name', duration, extraTime };
    const exams = { exam1: exam };
    it('should return blank if the test has never been started', () => {
        const attempts: Attempt[] = [];

        const examStatus = computeExamStatus(exams, attempts, now);

        expect(examStatus).toEqual({ exam1: 'notStarted' });
    });

    it('should return pending if the test has been started and not expired (white zone)', () => {
        const startedAt = '2023-07-24 06:45:20.429 +0200';
        const attempt = { startedAt, endedAt: null, correctedAt: null, exam: { id: 'exam1' } };

        const attempts = [attempt];

        const examStatus = computeExamStatus(exams, attempts, now);

        expect(examStatus).toEqual({ exam1: 'pending' });
    });

    it('should return pending if the test has been started and not expired (gray zone)', () => {
        const startedAt = '2023-07-24 06:35:20.429 +0200';
        const correctedAt = null;

        const attempt = { startedAt, endedAt: null, correctedAt, exam: { id: 'exam1' } };

        const attempts = [attempt];

        const examStatus = computeExamStatus(exams, attempts, now);

        expect(examStatus).toEqual({ exam1: 'pending' });
    });

    it('should return expired if the test is expired and not finished', () => {
        const startedAt = '2023-07-24 06:10:20.429 +0200';
        const correctedAt = null;

        const attempt = { startedAt, endedAt: null, exam: { id: 'exam1' }, correctedAt };

        const attempts = [attempt];

        const examStatus = computeExamStatus(exams, attempts, now);

        expect(examStatus).toEqual({ exam1: 'expired' });
    });

    it('should return finished if the test is finished', () => {
        const startedAt = '2023-07-24 06:10:20.429 +0200';
        const endedAt = '2023-07-24 06:50:20.429 +0200';
        const correctedAt = null;
        const attempt = { startedAt, exam: { id: 'exam1' }, endedAt, correctedAt };

        const attempts = [attempt];

        const examStatus = computeExamStatus(exams, attempts, now);

        expect(examStatus).toEqual({ exam1: 'finished' });
    });

    it('should return corrected if the test is corrected', () => {
        const startedAt = '2023-07-24 06:10:20.429 +0200';
        const endedAt = '2023-07-24 06:50:20.429 +0200';
        const correctedAt = '2023-07-25 06:50:20.429 +0200';
        const attempt = {
            startedAt,
            exam: { id: 'exam1' },
            endedAt,
            correctedAt,
        };

        const attempts = [attempt];

        const examStatus = computeExamStatus(exams, attempts, now);

        expect(examStatus).toEqual({ exam1: 'corrected' });
    });

    it('should return corrected if the test is corrected although expired but not finished', () => {
        const startedAt = '2023-07-24 06:10:20.429 +0200';
        const endedAt = null;
        const correctedAt = '2023-07-25 06:50:20.429 +0200';
        const attempt = {
            startedAt,
            exam: { id: 'exam1' },
            endedAt,
            correctedAt,
        };

        const attempts = [attempt];

        const examStatus = computeExamStatus(exams, attempts, now);

        expect(examStatus).toEqual({ exam1: 'corrected' });
    });
});
