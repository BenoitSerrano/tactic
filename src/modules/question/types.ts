const questionKinds = ['qcm', 'questionTrou', 'phraseMelangee'] as const;
type questionKindType = (typeof questionKinds)[number];

export { questionKinds };
export type { questionKindType };
