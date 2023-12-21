import { encoder } from '../../lib/encoder';
import { Exam } from '../exam';
import { Question } from '../question';
import { questionDtoType } from '../question/types';
import { Attempt } from './Attempt.entity';
import { computeAutomaticMark } from './lib/computeAutomaticMark';
import { attemptAnswersType } from './types';

const attemptUtils = {
    computeIsTimeLimitExceeded,
    stringifyAnswers,
    parseAnswers,
    encodeMarks,
    decodeMarks,
    aggregateMarks,
};

function computeIsTimeLimitExceeded({
    startedAt,
    duration,
    extraTime,
    now,
}: {
    startedAt: Attempt['startedAt'];
    duration: Exam['duration'];
    extraTime: Exam['extraTime'];
    now: Date;
}) {
    const attemptStartedDate = new Date(startedAt);

    const elapsedSeconds = Math.floor((now.getTime() - attemptStartedDate.getTime()) / 1000);
    const extendedAllowedTime = (duration + extraTime) * 60;

    return elapsedSeconds > extendedAllowedTime;
}

function stringifyAnswers(attemptAnswers: attemptAnswersType) {
    let answers: string[] = [];
    for (const [questionId, decodedQuestionAnswer] of Object.entries(attemptAnswers)) {
        const answer = `${questionId}:${encoder.stringToBase64(`${decodedQuestionAnswer}`)}`;
        answers.push(answer);
    }
    return answers;
}

function parseAnswers(answers: string[]): attemptAnswersType {
    const ANSWER_REGEX = /(\d+):(.*)/;
    let attemptAnswers = answers.reduce((acc, answer) => {
        let regexMatch = answer.match(ANSWER_REGEX);
        if (!regexMatch) {
            throw new Error(`answer "${answer}" is wrongly formatted.`);
        }
        const [_, questionId, encodedQuestionAnswer] = regexMatch;
        const decodedQuestionAnswer = encoder.base64ToString(encodedQuestionAnswer);

        return { ...acc, [questionId]: decodedQuestionAnswer };
    }, {} as attemptAnswersType);
    return attemptAnswers;
}

function aggregateMarks({
    answers,
    marksArray,
    questions,
}: {
    answers: attemptAnswersType;
    questions: questionDtoType[];
    marksArray: Attempt['marks'];
}): Record<number, number | undefined> {
    const manualMarks = attemptUtils.decodeMarks(marksArray);

    const marks = questions.reduce((acc, question) => {
        let mark = 0;

        if (question.acceptableAnswersWithPoints.length !== 0) {
            mark = computeAutomaticMark({
                questionKind: question.kind,
                acceptableAnswersWithPoints: question.acceptableAnswersWithPoints,
                answer: answers[question.id],
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
