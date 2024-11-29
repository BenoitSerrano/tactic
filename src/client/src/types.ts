const questionKinds = [
    'qcm',
    'questionReponse',
    'phraseMelangee',
    'texteATrous',
    'texteLibre',
] as const;
type questionKindType = (typeof questionKinds)[number];

type gradeType = 'A' | 'B' | 'C' | 'D' | 'E';

type acceptableAnswerType = { grade: gradeType; answer: string };

type attemptStatusType = 'notStarted' | 'pending' | 'expired' | 'finished' | 'corrected';

export { questionKinds };

export type { questionKindType, attemptStatusType, acceptableAnswerType, gradeType };
