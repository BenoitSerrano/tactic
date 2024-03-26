import { gradeConverter } from '../../../../lib/gradeConverter';
import { questionWithAnswersType } from '../../types';

function computeDisplayedMark(question: questionWithAnswersType): {
    mark: string | undefined;
    points: number;
} {
    const points = question.points;
    if (question.kind === 'texteATrous' || question.kind === 'texteLibre') {
        if (question.mark === undefined) {
            const displayedMark = question.answer ? undefined : '0';
            return { mark: displayedMark, points };
        } else {
            return { mark: `${question.mark}`, points };
        }
    }
    const displayedMark = gradeConverter.convertGradeToMark(question.grade, question.points);
    return { mark: `${displayedMark}`, points };
}

export { computeDisplayedMark };
