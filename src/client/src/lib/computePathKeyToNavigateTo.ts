import { attemptActionType } from './attemptActionEncoder';

function computePathKeyToNavigateTo<attemptT extends { id: string; correctedAt: string | null }>(
    attempt: attemptT | undefined,
    attemptAction: attemptActionType,
) {
    if (!attempt) {
        return 'STUDENT_HOME';
    } else {
        switch (attemptAction) {
            case 'take':
                return 'EXAM_TAKING';
            case 'consult':
                if (!!attempt.correctedAt) {
                    return 'EXAM_CONSULTING';
                } else {
                    return 'ATTEMPT_NOT_CORRECTED';
                }
        }
    }
}

export { computePathKeyToNavigateTo };
