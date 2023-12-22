import { acceptableAnswerWithPointsType, questionKindType } from '../../types';

type exerciseApiType = {
    id: number;
    name: string;
    defaultPoints: number;
    defaultQuestionKind: questionKindType;
    questions: Array<questionWithAnswersType>;
};

type questionWithAnswersType = {
    id: number;
    kind: questionKindType;
    title: string;
    points: number;
    acceptableAnswers: acceptableAnswerWithPointsType[];
    possibleAnswers: string[] | null;
};

export type { questionWithAnswersType, exerciseApiType };
