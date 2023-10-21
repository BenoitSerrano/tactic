import { encoder } from '../../lib/encoder';
import { AttemptInterface } from './attempt.interface';
import { attemptAnswersType } from './types';

const attemptUtils = {
    isTimeLimitExceeded,
    stringifyAnswers,
    parseAnswers,
};

function isTimeLimitExceeded(attempt: AttemptInterface, now: Date) {
    const attemptStartedDate = new Date(attempt.startedAt);

    const elapsedSeconds = Math.floor((now.getTime() - attemptStartedDate.getTime()) / 1000);
    const extendedAllowedTime = (attempt.exam.duration + attempt.exam.extraTime) * 60;

    return elapsedSeconds > extendedAllowedTime;
}

function stringifyAnswers(attemptAnswers: attemptAnswersType) {
    let answers: string[] = [];
    for (const [questionId, encodedQuestionAnswer] of Object.entries(attemptAnswers)) {
        const answer = `${questionId}:${encoder.stringToBase64(`${encodedQuestionAnswer}`)}`;
        answers.push(answer);
    }
    return answers;
}

function parseAnswers(answers: string[]): attemptAnswersType {
    const ANSWER_REGEX = /(\d+):(.*)/;
    let attemptAnswers = answers.reduce((acc, answer) => {
        let regexMatch = answer.match(ANSWER_REGEX);
        if (!regexMatch) {
            throw new Error(`answer ${answer} is wrongly formatted.`);
        }
        const [_, questionId, encodedQuestionAnswer] = regexMatch;
        const questionAnswer = encoder.base64ToString(encodedQuestionAnswer);

        return { ...acc, [questionId]: questionAnswer };
    }, {} as attemptAnswersType);
    return attemptAnswers;
}

export { attemptUtils };
