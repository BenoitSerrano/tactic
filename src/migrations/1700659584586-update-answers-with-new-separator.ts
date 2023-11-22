import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAnswersWithNewSeparator1700659584586 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const attempts = await queryRunner.query(`SELECT * FROM attempt`);
        const questions = await queryRunner.query(`SELECT * FROM question`);
        const texteATrouQuestionIds: number[] = questions
            .filter((question: any) => question.kind === 'texteATrous')
            .map((question: any) => question.id);
        for (const attempt of attempts) {
            const previousAnswers = attempt.answers ? parseAnswers(attempt.answers.split(',')) : [];
            const nextAnswers = Object.keys(previousAnswers).reduce((acc, questionId) => {
                const previousAnswer = previousAnswers[Number(questionId)];
                if (texteATrouQuestionIds.includes(Number(questionId))) {
                    return { ...acc, [questionId]: previousAnswer.replace(/ /g, '|') };
                } else {
                    return { ...acc, [questionId]: previousAnswer };
                }
            }, {} as attemptAnswersType);
            await queryRunner.query(
                `UPDATE attempt SET "answers"='${stringifyAnswers(nextAnswers)}' WHERE "id"='${
                    attempt.id
                }'`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const attempts = await queryRunner.query(`SELECT * FROM attempt`);
        const questions = await queryRunner.query(`SELECT * FROM question`);
        const texteATrouQuestionIds: number[] = questions
            .filter((question: any) => question.kind === 'texteATrous')
            .map((question: any) => question.id);
        for (const attempt of attempts) {
            const previousAnswers = attempt.answers ? parseAnswers(attempt.answers.split(',')) : [];
            const nextAnswers = Object.keys(previousAnswers).reduce((acc, questionId) => {
                const previousAnswer = previousAnswers[Number(questionId)];
                if (texteATrouQuestionIds.includes(Number(questionId))) {
                    return { ...acc, [questionId]: previousAnswer.replace(/\|/g, ' ') };
                } else {
                    return { ...acc, [questionId]: previousAnswer };
                }
            }, {} as attemptAnswersType);
            await queryRunner.query(
                `UPDATE attempt SET "answers"='${stringifyAnswers(nextAnswers)}' WHERE "id"='${
                    attempt.id
                }'`,
            );
        }
    }
}

function base64ToString(str: string): string {
    return Buffer.from(str, 'base64').toString();
}

function stringToBase64(str: string) {
    return Buffer.from(str).toString('base64');
}

type attemptAnswersType = Record<number, string>;

function stringifyAnswers(attemptAnswers: attemptAnswersType) {
    let answers: string[] = [];
    for (const [questionId, encodedQuestionAnswer] of Object.entries(attemptAnswers)) {
        const answer = `${questionId}:${stringToBase64(`${encodedQuestionAnswer}`)}`;
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
        const questionAnswer = base64ToString(encodedQuestionAnswer);

        return { ...acc, [questionId]: questionAnswer };
    }, {} as attemptAnswersType);
    return attemptAnswers;
}
