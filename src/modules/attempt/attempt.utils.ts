import { AttemptInterface } from './attempt.interface';
import { attemptAnswersType } from './types';

const attemptUtils = { isTimeLimitExceeded, stringifyAnswers, parseAnswers };

function isTimeLimitExceeded(attempt: AttemptInterface, now: Date) {
    const attemptStartedDate = new Date(attempt.startedAt);

    const elapsedSeconds = Math.floor((now.getTime() - attemptStartedDate.getTime()) / 1000);
    const extendedAllowedTime = (attempt.exam.duration + attempt.exam.extraTime) * 60;

    return elapsedSeconds > extendedAllowedTime;
}

// TODO: ne plus parler de qcmChoice, en fait c'est la qcmAnswer, c'est une string aussi tséquoi

function stringifyAnswers(attemptAnswers: attemptAnswersType) {
    let answers: string[] = [];
    for (const [qcmId, qcmAnswer] of Object.entries(attemptAnswers.qcmChoices)) {
        const answer = `QCM:${qcmId}-${btoa(`${qcmAnswer}`)}`;
        answers.push(answer);
    }

    for (const [questionTrouId, questionTrouAnswer] of Object.entries(
        attemptAnswers.questionTrouAnswers,
    )) {
        const answer = `QT:${questionTrouId}-${btoa(questionTrouAnswer)}`;
        answers.push(answer);
    }

    for (const [phraseMelangeeId, phraseMelangeeAnswer] of Object.entries(
        attemptAnswers.phraseMelangeeAnswers,
    )) {
        const answer = `PM:${phraseMelangeeId}-${btoa(phraseMelangeeAnswer)}`;
        answers.push(answer);
    }

    return answers;
}

function parseAnswers(answers: string[]): attemptAnswersType {
    const ANSWER_REGEX = /([A-Z]+):(\d+)-(.*)/;
    // const decodedAnswers = answers.map((answer) => atob(answer));
    let attemptAnswers = answers.reduce(
        (acc, answer) => {
            let regexMatch = answer.match(ANSWER_REGEX);
            if (!regexMatch) {
                throw new Error(`answer ${answer} is wrongly formatted.`);
            }
            const [_, questionType, questionId, encodedQuestionAnswer] = regexMatch;
            const questionAnswer = atob(encodedQuestionAnswer);
            let key: 'qcmChoices' | 'questionTrouAnswers' | 'phraseMelangeeAnswers' = 'qcmChoices';
            switch (questionType) {
                case 'QCM':
                    key = 'qcmChoices';
                    break;
                case 'QT':
                    key = 'questionTrouAnswers';
                    break;
                case 'PM':
                    key = 'phraseMelangeeAnswers';
                    break;
            }

            return { ...acc, [key]: { ...acc[key], [questionId]: questionAnswer } };
        },
        {
            qcmChoices: {},
            questionTrouAnswers: {},
            phraseMelangeeAnswers: {},
        } as attemptAnswersType,
    );
    return attemptAnswers;
}

export { attemptUtils };
