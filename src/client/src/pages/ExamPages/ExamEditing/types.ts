import { acceptableAnswerType, questionKindType } from '../../../types';

type examWithQuestionsApiType = {
    id: string;
    name: string;
    exercises: Array<exerciseWithQuestionsType>;
};

type exerciseWithQuestionsType = {
    id: number;
    instruction: string;
    name: string;
    defaultPoints: number;
    defaultQuestionKind: questionKindType;
    order: number;
    questions: Array<questionType>;
};

type questionType = {
    id: number;
    kind: questionKindType;
    title: string;
    points: number;
    order: number;
    acceptableAnswers: acceptableAnswerType[][];
    possibleAnswers: string[];
};

type exerciseUpsertionModalStatusType =
    | { kind: 'editing'; exercise: exerciseWithQuestionsType }
    | { kind: 'creating'; order: number };

type questionUpsertionModalStatusType =
    | {
          kind: 'editing';
          exercise: { id: number; defaultQuestionKind: questionKindType; defaultPoints: number };
          question: questionType;
      }
    | {
          kind: 'creating';
          exercise: { id: number; defaultQuestionKind: questionKindType; defaultPoints: number };
          order: number;
      };

export type {
    examWithQuestionsApiType,
    exerciseWithQuestionsType,
    questionType,
    exerciseUpsertionModalStatusType,
    questionUpsertionModalStatusType,
};
