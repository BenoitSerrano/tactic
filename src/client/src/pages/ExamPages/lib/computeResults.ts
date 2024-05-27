import { computeRoundMark } from '../../../lib/computeRoundMark';
import { gradeConverter } from '../../../lib/gradeConverter';
import { exerciseWithAnswersType } from '../types';
import { CONVERSION_DENOMINATOR } from './constants';

function computeResults(exercises: exerciseWithAnswersType[]): {
    total: string;
    converted: string;
} {
    let totalMark = 0;
    let totalPoints = 0;
    for (const exercise of exercises) {
        for (const question of exercise.questions) {
            const mark =
                question.kind === 'texteATrous' || question.kind === 'texteLibre'
                    ? question.mark
                    : gradeConverter.convertGradeToMark(question.grade, question.points);
            totalMark += mark || 0;
            totalPoints += question.points;
        }
    }
    const roundedTotalMark = computeRoundMark(totalMark);
    const roundedTotalPoints = computeRoundMark(totalPoints);

    const total = `${roundedTotalMark} / ${roundedTotalPoints}`;
    const roundedConvertedMark = computeRoundMark(
        (totalMark / totalPoints) * CONVERSION_DENOMINATOR,
    );
    const converted = `${roundedConvertedMark} / ${CONVERSION_DENOMINATOR}`;
    return { total, converted };
}
export { computeResults };
