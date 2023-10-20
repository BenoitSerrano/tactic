type questionType = {
    id: number;
    kind: questionKindType;
    title: string;
    possibleAnswers: string[] | null;
    currentAnswer: string;
    points: number;
};

const questionKinds = ['qcm', 'questionTrou', 'phraseMelangee'] as const;
type questionKindType = (typeof questionKinds)[number];
export { questionKinds };

export type { questionType, questionKindType };
