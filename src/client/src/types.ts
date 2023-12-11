const questionKinds = [
    'qcm',
    'questionTrou',
    'phraseMelangee',
    'texteATrous',
    'texteLibre',
] as const;
type questionKindType = (typeof questionKinds)[number];

type attemptsCountByAttemptStatusApiType = {
    corrected: number;
    notCorrected: number;
};

type acceptableAnswerWithPointsType = { points: number; answer: string };

type attemptStatusType = 'notStarted' | 'pending' | 'expired' | 'finished' | 'corrected';

export { questionKinds };

export type {
    questionKindType,
    attemptStatusType,
    attemptsCountByAttemptStatusApiType,
    acceptableAnswerWithPointsType,
};
