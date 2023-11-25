import { attemptStatusType } from '../../../types';

function computeCanUnlockAttempt(attemptStatus: attemptStatusType, isTimeLimitExceeded: boolean) {
    return attemptStatus === 'finished' && !isTimeLimitExceeded;
}
export { computeCanUnlockAttempt };
