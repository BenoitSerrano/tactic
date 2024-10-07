import { attemptStatusType } from '../../types';

const attemptStatusMapping: Record<attemptStatusType, number> = {
    notStarted: 0,
    pending: 1,
    finished: 2,
    expired: 3,
    corrected: 4,
};

export { attemptStatusMapping };
