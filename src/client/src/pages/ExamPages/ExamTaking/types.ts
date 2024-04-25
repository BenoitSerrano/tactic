import { examWithoutAnswersType } from '../types';

type attemptWithoutAnswersType = {
    id: string;
    correctedAt: string | null;
    startedAt: string;
    endedAt: string | undefined;
    updatedAt: string | undefined;
    studentEmail: string;
    exam: examWithoutAnswersType;
};

export type { attemptWithoutAnswersType };
