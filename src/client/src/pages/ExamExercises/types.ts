import { questionKindType } from '../../types';

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
    defaultQuestionKind: questionKindType;
    defaultPoints: number;
    totalPoints: number;
    order: number;
};

export type { examApiType, exerciseType, modalStatusType };
