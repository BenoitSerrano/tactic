export { computeQuestionTrouStatus };

function computeQuestionTrouStatus(
    answer: string | undefined,
    rightAnswers: string[],
    acceptableAnswers: string[],
): 'wrong' | 'acceptable' | 'right' {
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
        .replace(/’/g, "'");
}
