import { computePathKeyToNavigateTo } from './computePathKeyToNavigateTo';

describe('computePathKeyToNavigateTo', () => {
    it('should return STUDENT_HOME if no attempt', () => {
        const attempt = undefined;
        const attemptAction = 'take';

        const studentPathToNavigateTo = computePathKeyToNavigateTo(attempt, attemptAction);

        expect(studentPathToNavigateTo).toBe('STUDENT_HOME');
    });

    it('should return EXAM_TAKING if action is taking', () => {
        const attempt = { id: 'truc', correctedAt: null };
        const attemptAction = 'take';

        const studentPathToNavigateTo = computePathKeyToNavigateTo(attempt, attemptAction);

        expect(studentPathToNavigateTo).toBe('EXAM_TAKING');
    });

    it('should return EXAM_CONSULTING if action is consulting and correctedAt not null', () => {
        const attempt = { id: 'truc', correctedAt: '2023-06-19T20:28:03.314Z' };
        const attemptAction = 'consult';

        const studentPathToNavigateTo = computePathKeyToNavigateTo(attempt, attemptAction);

        expect(studentPathToNavigateTo).toBe('EXAM_CONSULTING');
    });

    it('should return ATTEMPT_NOT_CORRECTED if action is consulting but correctedAt is null', () => {
        const attempt = { id: 'truc', correctedAt: null };
        const attemptAction = 'consult';

        const studentPathToNavigateTo = computePathKeyToNavigateTo(attempt, attemptAction);

        expect(studentPathToNavigateTo).toBe('ATTEMPT_NOT_CORRECTED');
    });
});
