import { computeRoundMark } from '../../../lib/computeRoundMark';

function computeTotalPoints<
    questionT extends { points: number },
    exerciseT extends { questions: questionT[] },
>(exercises: exerciseT[]) {
    let totalPoints = 0;
    for (const exercise of exercises) {
        for (const question of exercise.questions) {
            totalPoints += question.points;
        }
    }
    const roundedTotalPoints = computeRoundMark(totalPoints);
    return `/ ${roundedTotalPoints}`;
}

export { computeTotalPoints };
