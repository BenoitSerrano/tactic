type questionType = {
    id: number;
    kind: questionKindType;
    title: string;
    possibleAnswers: string[];
    currentAnswer: string;
    points: number;
};
// TODO voir où c'est utilisé ça

const questionKinds = ['qcm', 'questionTrou', 'phraseMelangee', 'texteLibre'] as const;
type questionKindType = (typeof questionKinds)[number];

export { questionKinds };

export type { questionType, questionKindType };
