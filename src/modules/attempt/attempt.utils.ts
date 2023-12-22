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
    computeNotationInfo,
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

function computeNotationInfo({
    answers,
    marksArray,
    question,
}: {
    answers: attemptAnswersType;
    question: questionDtoType;
    marksArray: Attempt['marks'];
}) {
    const manualMarks = attemptUtils.decodeMarks(marksArray);

    const isQuestionManuallyCorrected = question.kind === 'texteLibre';
    if (isQuestionManuallyCorrected) {
        const mark = manualMarks[question.id] as number | undefined;
        const grade = convertMarkToGrade(mark, question.points);
        return { mark, grade };
    }

    return computeAutomaticMark({
        questionDto: question,
        answer: answers[question.id],
    });
}

function convertMarkToGrade(mark: number | undefined, totalPoints: number) {
    if (mark === undefined) {
        return undefined;
    }
    switch (mark / totalPoints) {
        case 1:
            return 'A';
        case 0.75:
            return 'B';
        case 0.5:
            return 'C';
        case 0.25:
            return 'D';
        case 0:
            return 'E';
    }
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
