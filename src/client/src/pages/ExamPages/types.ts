import { questionKindType } from '../../types';

type attemptWithAnswersApiType = {
    studentEmail: string;
    exam: examWithAnswersType;
};

type examWithAnswersType = {
    id: string;
    name: string;
    exercises: Array<exerciseWithAnswersType>;
};

type exerciseWithAnswersType = {
    id: number;
    name: string;
    instruction: string;
    questions: Array<questionWithAnswersType>;
};

type questionWithAnswersType = {
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

type examWithoutAnswersType = {
    duration: number;
    extraTime: number;
    name: string;
    exercises: Array<exerciseWithoutAnswersType>;
};

type exerciseWithoutAnswersType = {
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

type answerStatusType = 'wrong' | 'acceptable' | 'right' | undefined;

export type {
    attemptWithAnswersApiType,
    exerciseWithAnswersType,
    questionWithAnswersType,
    answerStatusType,
    examWithoutAnswersType,
    exerciseWithoutAnswersType,
    questionWithoutAnswerType,
};