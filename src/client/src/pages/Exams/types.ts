type examApiType = { id: string; name: string; duration: number };

type modalStatusType =
    | { kind: 'editing'; exam: examApiType }
    | { kind: 'creating'; onExamCreated: () => void };

export type { examApiType, modalStatusType };
