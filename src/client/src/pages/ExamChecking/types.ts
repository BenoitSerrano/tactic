type attemptWithAnswersApiType = {
    exam: { name: string; questions: Array<questionType> };
};

type questionType = { id: number; mark: number };

export type { attemptWithAnswersApiType, questionType };
