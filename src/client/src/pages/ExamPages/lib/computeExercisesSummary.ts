import { exerciseWithoutAnswersType } from '../types';
import { computeExerciseProgress } from './computeExerciseProgress';

function computeExercisesSummary(
    exercises: exerciseWithoutAnswersType[],
    currentAnswers: Record<number, string>,
): exerciseSummaryType[] {
    const progresses = exercises.map((exercise) =>
        computeExerciseProgress(exercise.questions, currentAnswers),
    );
    return exercises.map((exercise, exerciseIndex) => ({
        progress: progresses[exerciseIndex],
        name: exercise.name,
    }));
}

type exerciseSummaryType = {
    name: string;
    progress: number;
};

export { computeExercisesSummary };
export type { exerciseSummaryType };
