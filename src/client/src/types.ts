type trialType = Record<string, number>;

type questionType = { id: string; title: string; possibleAnswers: string[] };

type examType = { id: string; questions: Array<questionType>; solution: trialType };

export type { questionType, trialType, examType };
