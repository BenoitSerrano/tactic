type attemptWithAnswersApiType = {
    studentEmail: string;
    exam: { name: string; exercises: Array<{ id: number; questions: Array<questionType> }> };
};

type attemptIdsApiType = Array<string>;

type questionType = { id: number; mark: number };

export type { attemptWithAnswersApiType, questionType, attemptIdsApiType };
