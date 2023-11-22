const questionKinds = [
    'qcm',
    'questionTrou',
    'phraseMelangee',
    'texteLibre',
    'texteATrous',
] as const;
type questionKindType = (typeof questionKinds)[number];

type attemptStatusType = 'notStarted' | 'pending' | 'expired' | 'finished' | 'corrected';

export { questionKinds };

export type { questionKindType, attemptStatusType };
