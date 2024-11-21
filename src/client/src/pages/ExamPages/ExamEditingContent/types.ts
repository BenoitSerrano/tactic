import { acceptableAnswerType, questionKindType } from '../../../types';

type exerciseWithQuestionsType = {
    id: number;
    instruction: string;
    name: string;
    defaultPoints: number | null;
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
    | { kind: 'creating' };

type exerciseDefaultType = {
    id: number;
    defaultQuestionKind: questionKindType;
    defaultPoints: number | null;
};

type questionUpsertionModalStatusType =
    | {
          kind: 'editing';
          question: questionType;
      }
    | {
          kind: 'creating';
      };

export type {
    exerciseWithQuestionsType,
    questionType,
    exerciseUpsertionModalStatusType,
    questionUpsertionModalStatusType,
    exerciseDefaultType,
};
