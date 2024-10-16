import { useLocation } from 'react-router-dom';

const HASH_REGEX = /^#exercise-([0-9]+)$/;

type exerciseIndexesType = {
    current: number | undefined;
    previous: number | undefined;
    next: number | undefined;
};

function useExerciseIndex<T>(exercises: T[]): exerciseIndexesType {
    const { hash } = useLocation();
    const exerciseIndexes = computeExerciseIndex(exercises, hash);
    return exerciseIndexes;
}

function computeHash(exerciseIndex: number) {
    return `#exercise-${exerciseIndex}`;
}

function computeExerciseIndex<T>(exercises: T[], hash: string): exerciseIndexesType {
    let current, previous, next;
    if (exercises.length === 0) {
        return { current, previous, next };
    }
    const match = hash.match(HASH_REGEX);
    if (!match || Number(match[1]) > exercises.length - 1) {
        current = 0;
        if (exercises.length > 1) {
            next = 1;
            return { current, previous, next };
        }
        return { current, previous, next };
    }

    current = Number(match[1]);
    if (current > 0) {
        previous = current - 1;
    }
    if (current < exercises.length - 1) {
        next = current + 1;
    }

    return { current, previous, next };
}

export { useExerciseIndex, computeExerciseIndex, computeHash };
export type { exerciseIndexesType };
