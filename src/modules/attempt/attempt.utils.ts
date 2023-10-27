import { encoder } from '../../lib/encoder';
import { Question } from '../question';
import { Attempt } from './Attempt.entity';
import { AttemptInterface } from './attempt.interface';
import { computeAutomaticMark } from './lib/computeAutomaticMark';
import { attemptAnswersType } from './types';

const attemptUtils = {
    isTimeLimitExceeded,
    stringifyAnswers,
    parseAnswers,
    encodeMarks,
    decodeMarks,
    aggregateMarks,
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

function aggregateMarks({
    answers,
    marksArray,
    questions,
}: {
    answers: attemptAnswersType;
    questions: Question[];
    marksArray: Attempt['marks'];
}): Record<number, number | undefined> {
    const manualMarks = attemptUtils.decodeMarks(marksArray);

    const marks = questions.reduce((acc, question) => {
        let mark = 0;

        if (question.rightAnswers.length !== 0) {
            mark = computeAutomaticMark({
                questionKind: question.kind,
                acceptableAnswers: question.acceptableAnswers,
                answer: answers[question.id],
                points: question.points,
                rightAnswers: question.rightAnswers,
            });
        } else {
            mark = manualMarks[question.id];
        }
        return { ...acc, [question.id]: mark };
    }, {} as Record<number, number>);
    return marks;
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
