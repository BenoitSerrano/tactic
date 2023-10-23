import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEncodingToArrays1698088005119 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const questions = await queryRunner.query(`SELECT * FROM "question";`);
        for (const question of questions) {
            const encodedPossibleAnswers = question.possibleAnswers
                .split(',')
                .map((answer: string) => stringToBase64(answer))
                .join(',');
            const encodedRightAnswers = question.rightAnswers
                .split(',')
                .map((answer: string) => stringToBase64(answer))
                .join(',');
            const encodedAcceptableAnswers = question.acceptableAnswers
                .split(',')
                .map((answer: string) => stringToBase64(answer))
                .join(',');
            await queryRunner.query(
                `UPDATE "question" SET "possibleAnswers"='${encodedPossibleAnswers}', "rightAnswers"='${encodedRightAnswers}', "acceptableAnswers"='${encodedAcceptableAnswers}' WHERE "id"=${question.id}`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const questions = await queryRunner.query(`SELECT * FROM "question";`);
        for (const question of questions) {
            const decodedPossibleAnswers = question.possibleAnswers
                .split(',')
                .map((answer: string) => base64ToString(answer))
                .join(',');
            const decodedRightAnswers = question.rightAnswers
                .split(',')
                .map((answer: string) => base64ToString(answer))
                .join(',');
            const decodedAcceptableAnswers = question.acceptableAnswers
                .split(',')
                .map((answer: string) => base64ToString(answer))
                .join(',');
            await queryRunner.query(
                `UPDATE "question" SET "possibleAnswers"='${decodedPossibleAnswers}', "rightAnswers"='${decodedRightAnswers}', "acceptableAnswers"='${decodedAcceptableAnswers}' WHERE "id"=${question.id}`,
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
