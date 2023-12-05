import { attemptAnswersType } from '../types';

function computeExerciseProgress<questionT extends { id: number }>(
    questions: questionT[],
    attemptAnswers: attemptAnswersType,
): number {
    if (questions.length === 0) {
        return 0;
    }
    const answeredQuestionsCount = questions.filter(
        ({ id }) => attemptAnswers[id] !== '' && attemptAnswers[id] !== undefined,
    ).length;
    return answeredQuestionsCount / questions.length;
}

export { computeExerciseProgress };
