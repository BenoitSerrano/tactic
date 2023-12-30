import { computePathKeyToNavigateTo } from './computePathKeyToNavigateTo';
import { pathHandler } from './pathHandler';

describe('computePathKeyToNavigateTo', () => {
    it('should return STUDENT_HOME if no attempt', () => {
        const attempt = undefined;

        const studentPathToNavigateTo = computePathKeyToNavigateTo(attempt);

        expect(studentPathToNavigateTo).toBe('STUDENT_HOME');
    });

    it('should return EXAM_CONSULTING if attempt corrected', () => {
        const attempt = { id: 'truc', correctedAt: '2023-12-30T17:19:44.818Z' };

        const studentPathToNavigateTo = computePathKeyToNavigateTo(attempt);

        expect(studentPathToNavigateTo).toBe('EXAM_CONSULTING');
    });

    it('should return EXAM_TAKING if attempt not corrected', () => {
        const attempt = { id: 'truc', correctedAt: null };

        const studentPathToNavigateTo = computePathKeyToNavigateTo(attempt);

        expect(studentPathToNavigateTo).toBe('EXAM_TAKING');
    });
});
