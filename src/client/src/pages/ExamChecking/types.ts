import { questionKindType } from '../../types';

type attemptWithAnswersApiType = {
    studentEmail: string;
    exam: examType;
};

type examType = {
    id: string;
    name: string;
    exercises: Array<exerciseType>;
};

type exerciseType = {
    id: number;
    name: string;
    instruction: string;
    questions: Array<questionType>;
};

type questionType = {
    id: number;
    title: string;
    kind: questionKindType;
    rightAnswers: string[];
    acceptableAnswers: string[];
    possibleAnswers: string[];
    answer: string | undefined;
    mark: number | undefined;
    points: number;
};

type answerStatusType = 'wrong' | 'acceptable' | 'right';

export type { attemptWithAnswersApiType, exerciseType, questionType, answerStatusType };
