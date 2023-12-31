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
    questions: Array<questionType>;
};

type questionType = { id: number; points: number };

type exerciseUpsertionModalStatusType =
    | { kind: 'editing'; exercise: exerciseWithQuestionsType }
    | { kind: 'creating' };

export type {
    examWithQuestionsApiType,
    exerciseWithQuestionsType,
    exerciseUpsertionModalStatusType,
};
