type attemptWithAnswersApiType = {
    studentEmail: string;
    exam: { name: string; exercises: Array<{ id: number; questions: Array<questionType> }> };
};

type questionType = { id: number; mark: number };

export type { attemptWithAnswersApiType, questionType };
