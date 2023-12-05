type exerciseIndicationType = { hideMark?: boolean; progress?: number };

function computeExerciseIndication<
    questionT extends { mark?: number | undefined; points: number },
    exerciseT extends { questions: questionT[] },
>(
    exercise: exerciseT,
    indication?: exerciseIndicationType,
): { result: string; progress: number | undefined } {
    let result = '';
    let progress: number | undefined;
    let totalMark = 0;
    let totalPoints = 0;
    for (const question of exercise.questions) {
        totalMark += question.mark || 0;
        totalPoints += question.points;
    }
    if (!!indication?.hideMark) {
        result = `/ ${totalPoints}`;
    } else {
        result = `${totalMark} / ${totalPoints}`;
    }
    if (indication?.progress !== undefined) {
        progress = Math.floor(indication.progress * 100);
    }
    return { result, progress };
}

export { computeExerciseIndication };
export type { exerciseIndicationType };
