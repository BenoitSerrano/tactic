import { attemptStatusType } from '../../../types';

function computeCanLockAttempt(attemptStatus: attemptStatusType) {
    return attemptStatus === 'pending';
}

export { computeCanLockAttempt };
