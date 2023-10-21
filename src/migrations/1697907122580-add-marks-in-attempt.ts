import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMarksInAttempt1697907122580 implements MigrationInterface {
    name = 'AddMarksInAttempt1697907122580';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "attempt" ADD "marks" character varying NOT NULL DEFAULT ''`,
        );
        const questions: Array<any> = await queryRunner.query(`SELECT * FROM "question"`);
        const mappedQuestions = mapEntities(questions);
        const attempts = await queryRunner.query(`SELECT id,answers FROM "attempt"`);
        for (const attempt of attempts) {
            if (!attempt.answers) {
                continue;
            }

            const answers = parseAnswers(attempt.answers.split(','));
            const marks = computeMarks(mappedQuestions, answers);
            await queryRunner.query(
                `UPDATE "attempt" SET "marks"='${marks.join(',')}' WHERE "id"='${attempt.id}'`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "marks"`);
    }
}

function computeMarks(questions: Record<number, any>, answers: Record<number, string>) {
    const marks = Object.entries(answers).reduce((acc, [questionId, answer]) => {
        const question = questions[Number(questionId)];
        const status = computeQuestionAnswerStatus(
            answer as string,
            question.rightAnswers.split(','),
            question.acceptableAnswers.split(','),
        );
        switch (status) {
            case 'right':
                return { ...acc, [question.id]: (acc[question.id] || 0) + question.points };
            case 'acceptable':
                return { ...acc, [question.id]: (acc[question.id] || 0) + question.points / 2 };
            case 'wrong':
                return acc;
        }
    }, {} as Record<number, number>);
    return convertMarksToString(marks);
}

function convertMarksToString(marks: Record<number, number>) {
    return Object.entries(marks).map(([questionId, mark]) => `${questionId}:${mark}`);
}
function computeQuestionAnswerStatus(
    answer: string | undefined,
    rightAnswers: string[],
    acceptableAnswers: string[],
): 'right' | 'wrong' | 'acceptable' {
    if (answer === undefined) {
        return 'wrong';
    }
    if (
        rightAnswers.some((rightAnswer) => sanitizeString(rightAnswer) === sanitizeString(answer))
    ) {
        return 'right';
    } else if (
        acceptableAnswers.some(
            (acceptableAnswer) => sanitizeString(acceptableAnswer) === sanitizeString(answer),
        )
    ) {
        return 'acceptable';
    } else {
        return 'wrong';
    }
}

function sanitizeString(value: string) {
    return value
        .split(' ')
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .replace(/ ?' ?/g, "'")
        .replace(/é/g, 'é')
        .replace(/ê/g, 'ê')
        .replace(/’/g, "'");
}

function mapEntities<idT extends string | number, entityT extends { id: idT }>(
    entities: Array<entityT>,
) {
    return entities.reduce((acc, entity) => {
        return { ...acc, [entity.id]: entity };
    }, {} as Record<string, entityT>);
}

function parseAnswers(answers: string[]): Record<number, string> {
    const ANSWER_REGEX = /(\d+):(.*)/;
    let attemptAnswers = answers.reduce((acc, answer) => {
        let regexMatch = answer.match(ANSWER_REGEX);
        if (!regexMatch) {
            throw new Error(`answer ${answer} is wrongly formatted.`);
        }
        const [_, questionId, encodedQuestionAnswer] = regexMatch;
        const questionAnswer = base64ToString(encodedQuestionAnswer);

        return { ...acc, [questionId]: questionAnswer };
    }, {} as Record<number, string>);
    return attemptAnswers;
}

function base64ToString(str: string): string {
    return Buffer.from(str, 'base64').toString();
}
