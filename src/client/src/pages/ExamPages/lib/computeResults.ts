import { CONVERSION_DENOMINATOR, convertMark } from '../../../lib/convertMark';
import { gradeConverter } from '../../../lib/gradeConverter';
import { exerciseWithAnswersType } from '../types';

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
    const { roundedConvertedMark, roundedTotalMark, roundedTotalPoints } = convertMark({
        totalMark,
        totalPoints,
    });

    const total = `${roundedTotalMark} / ${roundedTotalPoints}`;

    const converted = `${roundedConvertedMark} / ${CONVERSION_DENOMINATOR}`;
    return { total, converted };
}
export { computeResults };
