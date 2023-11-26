function computeExerciseResult<
    questionT extends { mark?: number | undefined; points: number },
    exerciseT extends { questions: questionT[] },
>(exercise: exerciseT, options?: { hideMark?: boolean }) {
    let totalMark = 0;
    let totalPoints = 0;
    for (const question of exercise.questions) {
        totalMark += question.mark || 0;
        totalPoints += question.points;
    }
    if (options?.hideMark) {
        return `/ ${totalPoints}`;
    } else {
        return `${totalMark} / ${totalPoints}`;
    }
}

export { computeExerciseResult };
