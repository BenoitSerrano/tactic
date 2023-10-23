type examApiType = {
    id: string;
    exercises: Array<exerciseType>;
};

type exerciseType = { id: number; name: string; instruction: string; order: number };

export type { examApiType, exerciseType };
