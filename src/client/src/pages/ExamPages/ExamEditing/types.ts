type examWithQuestionsApiType = {
    id: string;
    name: string;
    exercises: Array<exerciseWithQuestionsType>;
};

type exerciseWithQuestionsType = {
    id: number;
    instruction: string;
    name: string;
    questions: Array<questionType>;
};

type questionType = { id: number; points: number };

export type { examWithQuestionsApiType, exerciseWithQuestionsType };
