import { questionKindType } from '../../types';

type exerciseApiType = { id: number; questions: Array<questionWithAnswersType> };

type questionWithAnswersType = {
    id: number;
    kind: questionKindType;
    title: string;
    points: number;
    rightAnswers: string[];
    acceptableAnswers: string[];
    possibleAnswers: string[] | null;
};

export type { questionWithAnswersType, exerciseApiType };
