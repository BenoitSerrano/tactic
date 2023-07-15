type modalStatusType<questionTypeT> =
    | { kind: 'editing'; question: questionTypeT }
    | { kind: 'creating' };

export type { modalStatusType };
