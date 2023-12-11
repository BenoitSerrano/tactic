const acceptableAnswerParser = { parse, stringify };

function parse(acceptableAnswerWithPoints: string) {
    const ACCEPTABLE_ANSWER_REGEX = /^(\d+(?:.\d+)?):(.*)$/;
    const match = acceptableAnswerWithPoints.match(ACCEPTABLE_ANSWER_REGEX);
    if (!match) {
        throw new Error(`Wrongly formatted acceptable Answer: ${acceptableAnswerWithPoints}`);
    }
    const points = Number(match[1]);
    const answer = match[2];
    return { points, answer };
}

function stringify(acceptableAnswerWithPoints: { points: number; answer: string }) {
    return `${acceptableAnswerWithPoints.points}:${acceptableAnswerWithPoints.answer}`;
}

export { acceptableAnswerParser };
