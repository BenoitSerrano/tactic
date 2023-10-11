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
// TODO: utiliser fonction à l'insertion et au decodage de la BDD

function stringifyAnswers(attemptAnswers: attemptAnswersType) {
    let answers: string[] = [];

    Object.entries(attemptAnswers.qcmChoices).forEach(([qcmId, qcmAnswer]) => {
        answers.push(`QCM:${qcmId}-${qcmAnswer}`);
    });

    Object.entries(attemptAnswers.questionTrouAnswers).forEach(
        ([questionTrouId, questionTrouAnswer]) => {
            answers.push(`QT:${questionTrouId}-${questionTrouAnswer}`);
        },
    );

    Object.entries(attemptAnswers.phraseMelangeeAnswers).forEach(
        ([phraseMelangeeId, phraseMelangeeAnswer]) => {
            answers.push(`PM:${phraseMelangeeId}-${phraseMelangeeAnswer}`);
        },
    );
    return answers.map((answer) => btoa(answer));
}

function parseAnswers(answers: string[]): attemptAnswersType {
    const ANSWER_REGEX = /([A-Z]+):(\d+)-(.*)/;
    const decodedAnswers = answers.map((answer) => atob(answer));
    let attemptAnswers = decodedAnswers.reduce(
        (acc, answer) => {
            let regexMatch = answer.match(ANSWER_REGEX);
            if (!regexMatch) {
                throw new Error(`answer ${answer} is wrongly formatted.`);
            }
            const [_, questionType, questionId, questionAnswer] = regexMatch;
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
