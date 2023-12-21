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
    acceptableAnswersWithPoints: acceptableAnswerWithPointsType[][];
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
        return chunks.reduce((mark, chunk, index) => {
            const acceptableAnswers = acceptableAnswersWithPoints[index];
            const matchingAcceptableAnswer = acceptableAnswers.find(
                ({ answer, points }) =>
                    sanitizer.sanitizeString(answer) === sanitizer.sanitizeString(chunk),
            );

            if (matchingAcceptableAnswer) {
                return mark + matchingAcceptableAnswer.points;
            } else {
                return mark;
            }
        }, 0);
    }
    if (acceptableAnswersWithPoints.length === 0 || acceptableAnswersWithPoints[0].length === 0) {
        throw new Error(`Cannot compute automatic mark for acceptableAnswersWithPoints=[]`);
    }
    if (answer === undefined) {
        return 0;
    }
    const matchingAcceptableAnswer = acceptableAnswersWithPoints[0].find(
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
