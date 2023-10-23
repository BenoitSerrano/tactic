import { questionKindType } from '../../types';

type attemptWithoutAnswersType = {
    startedAt: string;
    exam: {
        duration: number;
        extraTime: number;
        name: string;
        exercises: Array<exerciseType>;
    };
};

type exerciseType = {
    id: number;
    name: string;
    instruction: string;
    questions: Array<questionWithoutAnswerType>;
};

type questionWithoutAnswerType = {
    id: number;
    kind: questionKindType;
    title: string;
    possibleAnswers: string[];
    currentAnswer: string;
    points: number;
};

export type { attemptWithoutAnswersType, questionWithoutAnswerType, exerciseType };
