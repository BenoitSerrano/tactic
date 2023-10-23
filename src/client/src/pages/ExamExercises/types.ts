type examApiType = {
    id: string;
    exercises: Array<exerciseType>;
};

type modalStatusType = { kind: 'editing'; exercise: exerciseType } | { kind: 'creating' };

type exerciseType = { id: number; name: string; instruction: string; order: number };

export type { examApiType, exerciseType, modalStatusType };
