import { exerciseWithAnswersType } from '../types';

function computeResult(exercises: exerciseWithAnswersType[]) {
    let totalMark = 0;
    let totalPoints = 0;
    for (const exercise of exercises) {
        for (const question of exercise.questions) {
            totalMark += question.mark || 0;
            totalPoints += question.points;
        }
    }

    return `${totalMark} / ${totalPoints}`;
}

export { computeResult };
