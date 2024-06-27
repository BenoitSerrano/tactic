import { attemptStatusType } from '../../types';

type examResultApiType = {
    id: string;
    email: string;
    attemptId: string;
    startedAt: string;
    isTimeLimitExceeded: boolean;
    attemptStatus: attemptStatusType;
    actualDuration: number | undefined;
    mark: number;
    roundTrips: number;
    timeSpentOutside: number;
};

type examResultsApiType = {
    results: Array<examResultApiType>;
    totalPoints: number;
    examName: string;
    examDuration: number;
};

export type { examResultApiType, examResultsApiType };
