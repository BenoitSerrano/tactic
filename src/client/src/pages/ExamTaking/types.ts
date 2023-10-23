import { questionKindType } from '../../types';

type attemptWithoutAnswersType = {
    startedAt: string;
    exam: {
        duration: number;
        extraTime: number;
        name: string;
        exercises: Array<{ id: number; questions: Array<questionWithoutAnswer> }>;
    };
};

type questionWithoutAnswer = {
    id: number;
    kind: questionKindType;
    title: string;
    possibleAnswers: string[];
    currentAnswer: string;
    points: number;
};

export type { attemptWithoutAnswersType, questionWithoutAnswer };
