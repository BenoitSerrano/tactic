import { attemptStatusType } from '../../../types';

type studentsSummaryType = {
    students: Array<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdDate: string;
        examStatus: Record<
            string,
            { attemptStatus: attemptStatusType; attemptId: string | undefined; mark: number }
        >;
    }>;
    examInfos: Record<string, { name: string; totalPoints: number }>;
};

export type { studentsSummaryType };
