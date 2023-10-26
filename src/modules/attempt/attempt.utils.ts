import { encoder } from '../../lib/encoder';
import { Question } from '../question';
import { AttemptInterface } from './attempt.interface';
import { computeMark } from './lib/computeMark';
import { attemptAnswersType } from './types';

const attemptUtils = {
    isTimeLimitExceeded,
    stringifyAnswers,
    parseAnswers,
    computeMarks,
    encodeMarks,
    decodeMarks,
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

function computeMarks(
    questions: Record<
        Question['id'],
        Pick<
            Question,
            | 'id'
            | 'kind'
            | 'title'
            | 'acceptableAnswers'
            | 'rightAnswers'
            | 'possibleAnswers'
            | 'points'
        >
    >,
    answers: attemptAnswersType,
) {
    const marks = Object.entries(questions).reduce((acc, [questionId, question]) => {
        const answer: string = answers[Number(questionId)];

        const mark = computeMark({
            questionKind: question.kind,
            acceptableAnswers: question.acceptableAnswers,
            answer,
            points: question.points,
            rightAnswers: question.rightAnswers,
        });
        if (mark === undefined) {
            return acc;
        }
        return { ...acc, [question.id]: mark };
    }, {} as Record<Question['id'], number>);
    return encodeMarks(marks);
}

function encodeMarks(marks: Record<Question['id'], number>) {
    return Object.entries(marks).map(([questionId, mark]) => `${questionId}:${mark}`);
}

function decodeMarks(marksArray: string[]): Record<Question['id'], number> {
    return marksArray.reduce((acc, markEntry) => {
        const splitMark = markEntry.split(':');
        if (splitMark.length !== 2) {
            throw new Error(`marksArray '${marksArray.join(',')}' is wrongly formatted`);
        }
        const [questionId, mark] = splitMark;
        return { ...acc, [Number(questionId)]: Number(mark) };
    }, {} as Record<Question['id'], number>);
}

export { attemptUtils };
