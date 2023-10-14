type questionType = {
    id: number;
    kind: questionKindType;
    title: string;
    possibleAnswers: string[] | null;
    currentAnswer: string;
    points: number;
};

type questionKindType = 'qcm' | 'questionTrou' | 'phraseMelangee';

export type { questionType, questionKindType };
