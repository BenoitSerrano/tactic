const acceptableAnswerParser = {
    parse,
    stringify,
};

function stringify(acceptableAnswer: { points: number; answer: string }) {
    return `${acceptableAnswer.points}:${acceptableAnswer.answer}`;
}

function parse(acceptableAnswer: string) {
    const ACCEPTABLE_ANSWER_REGEX = /^(\d+(?:.\d+)?):(.*)$/;
    const match = acceptableAnswer.match(ACCEPTABLE_ANSWER_REGEX);
    if (!match) {
        throw new Error(`Wrongly formatted acceptable Answer: ${acceptableAnswer}`);
    }
    const points = Number(match[1]);
    const answer = match[2];
    return { points, answer };
}
export { acceptableAnswerParser };
