import { encoder } from '../../lib/encoder';
import { Exam } from '../exam';
import { Question } from '../question';
import { convertGradeToMark } from '../question/lib/convertGradeToMark';
import { gradeType, questionDtoType } from '../question/types';
import { Attempt } from './Attempt.entity';
import { computeAutomaticMark } from './lib/computeAutomaticMark';
import { attemptAnswersType } from './types';

const attemptUtils = {
    computeIsTimeLimitExceeded,
    stringifyAnswers,
    parseAnswers,
    encodeGrades,
    decodeGrades,
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
    if (duration === null) {
        return false;
    }
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
    gradesArray,
    question,
}: {
    answers: attemptAnswersType;
    question: questionDtoType;
    gradesArray: Attempt['manualGrades'];
}) {
    const manualGrades = attemptUtils.decodeGrades(gradesArray);

    const isQuestionManuallyCorrected = question.kind === 'texteLibre';
    if (isQuestionManuallyCorrected) {
        const grade = manualGrades[question.id] || undefined;
        const mark = convertGradeToMark(grade, question.points);
        return { grade, mark };
    }

    return computeAutomaticMark({
        questionDto: question,
        answer: answers[question.id],
    });
}

function encodeGrades(grades: Record<Question['id'], gradeType>) {
    return Object.entries(grades).map(([questionId, grade]) => `${questionId}:${grade}`);
}

function decodeGrades(gradesArray: string[]): Record<Question['id'], gradeType> {
    return gradesArray.reduce((acc, gradeEntry) => {
        const splitGrade = gradeEntry.split(':');
        if (splitGrade.length !== 2) {
            throw new Error(`gradesArray '${gradesArray.join(',')}' is wrongly formatted`);
        }
        const [questionId, grade] = splitGrade;
        return { ...acc, [Number(questionId)]: grade as gradeType };
    }, {} as Record<Question['id'], gradeType>);
}

export { attemptUtils };
