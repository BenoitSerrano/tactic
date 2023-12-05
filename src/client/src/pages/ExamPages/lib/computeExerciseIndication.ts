type exerciseIndicationType = { hideMark?: boolean; progress?: number };

function computeExerciseIndication<
    questionT extends { mark?: number | undefined; points: number },
    exerciseT extends { questions: questionT[] },
>(exercise: exerciseT, indication?: exerciseIndicationType) {
    let result = '';
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
        const progress = Math.floor(indication.progress * 100);
        result = result + ` (${progress}% complétés)`;
    }
    return result;
}

export { computeExerciseIndication };
export type { exerciseIndicationType };
