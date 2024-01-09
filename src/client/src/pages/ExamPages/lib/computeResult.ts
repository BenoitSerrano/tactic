import { computeRoundMark } from '../../../lib/computeRoundMark';
import { gradeConverter } from '../../../lib/gradeConverter';
import { exerciseWithAnswersType } from '../types';

function computeResult(exercises: exerciseWithAnswersType[]) {
    let totalMark = 0;
    let totalPoints = 0;
    for (const exercise of exercises) {
        for (const question of exercise.questions) {
            const mark =
                question.kind === 'texteATrous'
                    ? question.mark
                    : gradeConverter.convertGradeToMark(question.grade, question.points);
            totalMark += mark || 0;
            totalPoints += question.points;
        }
    }
    const roundedTotalMark = computeRoundMark(totalMark);
    const roundedTotalPoints = computeRoundMark(totalPoints);

    return `${roundedTotalMark} / ${roundedTotalPoints}`;
}
export { computeResult };
