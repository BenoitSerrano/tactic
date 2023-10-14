import { questionType } from '../../types';

type attemptWithoutAnswersType = {
    startedAt: string;
    exam: {
        duration: number;
        extraTime: number;
        name: string;
        questions: Array<questionType>;
    };
};

export type { attemptWithoutAnswersType, questionType };
