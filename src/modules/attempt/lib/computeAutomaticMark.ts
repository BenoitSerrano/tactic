import { sanitizer } from '../../../lib/sanitizer';
import { acceptableAnswerWithPointsType, questionKindType } from '../../question/types';

export { computeAutomaticMark };

function computeAutomaticMark({
    questionKind,
    answer,
    acceptableAnswersWithPoints,
}: {
    questionKind: questionKindType;
    answer: string | undefined;
    acceptableAnswersWithPoints: acceptableAnswerWithPointsType[];
}): number {
    if (!answer) {
        return 0;
    }
    if (questionKind === 'texteATrous') {
        const chunks = answer.split('|');

        if (chunks.length !== acceptableAnswersWithPoints.length) {
            throw new Error(
                `The answer "${answer}" does not have the same number of chunks as acceptableAnswersWithPoints "${acceptableAnswersWithPoints.join(
                    '|',
                )}"`,
            );
        }
        return chunks.reduce((mark, word, index) => {
            const { points, answer } = acceptableAnswersWithPoints[index];

            if (sanitizer.sanitizeString(word) === sanitizer.sanitizeString(answer)) {
                return mark + points;
            } else {
                return mark;
            }
        }, 0);
    }
    if (acceptableAnswersWithPoints.length === 0) {
        throw new Error(`Cannot compute automatic mark for acceptableAnswersWithPoints=[]`);
    }
    if (answer === undefined) {
        return 0;
    }
    const matchingAcceptableAnswer = acceptableAnswersWithPoints.find(
        (acceptableAnswerWithPoints) =>
            sanitizer.sanitizeString(acceptableAnswerWithPoints.answer) ===
            sanitizer.sanitizeString(answer),
    );
    if (matchingAcceptableAnswer) {
        return matchingAcceptableAnswer.points;
    } else {
        return 0;
    }
}
