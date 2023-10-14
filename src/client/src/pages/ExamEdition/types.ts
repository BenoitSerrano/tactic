import { questionKindType } from '../../types';

type questionWithAnswersType = {
    id: number;
    kind: questionKindType;
    title: string;
    points: number;
    rightAnswers: string[];
    acceptableAnswers: string[];
    possibleAnswers: string[] | null;
};

export type { questionWithAnswersType };
