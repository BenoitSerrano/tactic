import { acceptableAnswerType, gradeType } from '../types';

const acceptableAnswerParser = { parse, stringify };

function parse(acceptableAnswer: string) {
    const ACCEPTABLE_ANSWER_REGEX = /^([A-D]):(.*)$/;
    const match = acceptableAnswer.match(ACCEPTABLE_ANSWER_REGEX);
    if (!match) {
        throw new Error(`Wrongly formatted acceptable Answer: ${acceptableAnswer}`);
    }
    const grade = match[1] as gradeType;
    const answer = match[2];
    return { grade, answer };
}

function stringify(acceptableAnswer: acceptableAnswerType) {
    return `${acceptableAnswer.grade}:${acceptableAnswer.answer}`;
}

export { acceptableAnswerParser };
