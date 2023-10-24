type examApiType = {
    id: string;
    name: string;
    exercises: Array<exerciseType>;
};

type modalStatusType = { kind: 'editing'; exercise: exerciseType } | { kind: 'creating' };

type exerciseType = {
    id: number;
    name: string;
    instruction: string;
    defaultPoints: number;
    order: number;
};

export type { examApiType, exerciseType, modalStatusType };
