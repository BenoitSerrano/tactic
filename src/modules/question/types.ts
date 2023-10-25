const questionKinds = [
    'qcm',
    'questionTrou',
    'phraseMelangee',
    'texteLibre',
    'texteATrous',
] as const;
type questionKindType = (typeof questionKinds)[number];

export { questionKinds };
export type { questionKindType };
