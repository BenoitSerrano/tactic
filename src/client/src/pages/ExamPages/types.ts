import { acceptableAnswerType, attemptStatusType, gradeType, questionKindType } from '../../types';

type attemptWithAnswersApiType = {
    id: string;
    correctedAt: string | null;
    studentEmail: string;
    exam: examWithAnswersType;
    attemptStatus: attemptStatusType;
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

type questionWithAnswersType =
    | texteATrousWithAnswersType
    | qcmWithAnswersType
    | texteLibreWithAnswersType
    | otherQuestionKindAnswersType;

type amendableQuestionWithAnswersType = texteLibreWithAnswersType | otherQuestionKindAnswersType;

type texteATrousWithAnswersType = {
    id: number;
    title: string;
    kind: 'texteATrous';
    acceptableAnswers: acceptableAnswerType[][];
    answer: string | undefined;
    mark: number | undefined;
    points: number;
};

type qcmWithAnswersType = {
    id: number;
    title: string;
    kind: 'qcm';
    acceptableAnswers: acceptableAnswerType[][];
    possibleAnswers: string[];
    answer: string | undefined;
    grade: gradeType;
    points: number;
};

type texteLibreWithAnswersType = {
    id: number;
    title: string;
    kind: 'texteLibre';
    answer: string | undefined;
    grade: gradeType | undefined;
    points: number;
};

type otherQuestionKindAnswersType = {
    id: number;
    title: string;
    kind: 'phraseMelangee' | 'questionReponse';
    acceptableAnswers: acceptableAnswerType[][];
    answer: string | undefined;
    grade: gradeType;
    points: number;
};

type examWithoutAnswersType = {
    duration: number | null;
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

type attemptAnswersType = Record<number, string>;

type answerStatusType = 'wrong' | 'acceptable' | 'right' | undefined;

export type {
    examWithAnswersType,
    attemptAnswersType,
    attemptWithAnswersApiType,
    exerciseWithAnswersType,
    questionWithAnswersType,
    answerStatusType,
    examWithoutAnswersType,
    exerciseWithoutAnswersType,
    questionWithoutAnswerType,
    amendableQuestionWithAnswersType,
};
