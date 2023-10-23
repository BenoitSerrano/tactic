import { questionAnswerStatusType } from '../types';

export { computeQuestionAnswerStatus };

function computeQuestionAnswerStatus(
    answer: string | undefined,
    rightAnswers: string[],
    acceptableAnswers: string[],
): questionAnswerStatusType {
    if (rightAnswers.length === 0) {
        return undefined;
    }
    if (answer === undefined) {
        return 'wrong';
    }
    if (
        rightAnswers.some((rightAnswer) => sanitizeString(rightAnswer) === sanitizeString(answer))
    ) {
        return 'right';
    } else if (
        acceptableAnswers.some(
            (acceptableAnswer) => sanitizeString(acceptableAnswer) === sanitizeString(answer),
        )
    ) {
        return 'acceptable';
    } else {
        return 'wrong';
    }
}

function sanitizeString(value: string) {
    return value
        .split(' ')
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .replace(/ ?' ?/g, "'")
        .replace(/é/g, 'é')
        .replace(/ê/g, 'ê')
        .replace(/’/g, "'");
}
