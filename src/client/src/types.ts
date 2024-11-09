const questionKinds = [
    'qcm',
    'questionReponse',
    'phraseMelangee',
    'texteATrous',
    'texteLibre',
] as const;
type questionKindType = (typeof questionKinds)[number];

type attemptsCountByAttemptStatusApiType = {
    corrected: number;
    notCorrected: number;
};

type gradeType = 'A' | 'B' | 'C' | 'D' | 'E';

type acceptableAnswerType = { grade: gradeType; answer: string };

type attemptStatusType = 'notStarted' | 'pending' | 'expired' | 'finished' | 'corrected';

type examFilterType = 'archived' | 'current' | 'all';

export { questionKinds };

export type {
    questionKindType,
    attemptStatusType,
    attemptsCountByAttemptStatusApiType,
    acceptableAnswerType,
    gradeType,
    examFilterType,
};
