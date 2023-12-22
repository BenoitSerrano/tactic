import { sanitizer } from '../../../lib/sanitizer';
import { acceptableAnswerWithPointsType, questionKindType } from '../../question/types';

export { computeAutomaticMark };

function computeAutomaticMark({
    questionKind,
    answer,
    acceptableAnswers,
}: {
    questionKind: questionKindType;
    answer: string | undefined;
    acceptableAnswers: acceptableAnswerWithPointsType[];
}): number {
    if (!answer) {
        return 0;
    }
    if (questionKind === 'texteATrous') {
        const chunks = answer.split('|');

        if (chunks.length !== acceptableAnswers.length) {
            throw new Error(
                `The answer "${answer}" does not have the same number of chunks as acceptableAnswers "${acceptableAnswers.join(
                    '|',
                )}"`,
            );
        }
        return chunks.reduce((mark, word, index) => {
            const { points, answer } = acceptableAnswers[index];

            if (sanitizer.sanitizeString(word) === sanitizer.sanitizeString(answer)) {
                return mark + points;
            } else {
                return mark;
            }
        }, 0);
    }
    if (acceptableAnswers.length === 0) {
        throw new Error(`Cannot compute automatic mark for acceptableAnswers=[]`);
    }
    if (answer === undefined) {
        return 0;
    }
    const matchingAcceptableAnswer = acceptableAnswers.find(
        (acceptableAnswer) =>
            sanitizer.sanitizeString(acceptableAnswer.answer) === sanitizer.sanitizeString(answer),
    );
    if (matchingAcceptableAnswer) {
        return matchingAcceptableAnswer.points;
    } else {
        return 0;
    }
}
