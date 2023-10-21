const questionKinds = ['qcm', 'questionTrou', 'phraseMelangee', 'texteLibre'] as const;
type questionKindType = (typeof questionKinds)[number];

export { questionKinds };
export type { questionKindType };
