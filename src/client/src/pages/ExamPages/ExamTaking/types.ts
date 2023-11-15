import { examWithoutAnswersType } from '../types';

type attemptWithoutAnswersType = {
    startedAt: string;
    endedAt: string | undefined;
    studentEmail: string;
    exam: examWithoutAnswersType;
};

export type { attemptWithoutAnswersType };
