import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFormatAcceptableAnswers1702141293479 implements MigrationInterface {
    name = 'ChangeFormatAcceptableAnswers1702141293479';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "question" ADD "acceptableAnswersWithPoints" text NOT NULL DEFAULT ''`,
        );
        const questions: Array<any> = await queryRunner.query(`SELECT * FROM "question"`);
        for (const question of questions) {
            const id: number = Number(question.id);
            const points: number = Number(question.points);
            const acceptableAnswersWithPoints: string[] = [];
            const acceptableAnswers = question.acceptableAnswers
                ? (question.acceptableAnswers as string).split(',')
                : [];
            const rightAnswers = question.rightAnswers
                ? (question.rightAnswers as string).split(',')
                : [];
            for (const acceptableAnswer of acceptableAnswers) {
                acceptableAnswersWithPoints.push(stringify(points / 2, acceptableAnswer));
            }
            for (const rightAnswer of rightAnswers) {
                acceptableAnswersWithPoints.push(stringify(points, rightAnswer));
            }
            if (acceptableAnswersWithPoints.length > 0) {
                await queryRunner.query(
                    `UPDATE "question" SET "acceptableAnswersWithPoints"='${acceptableAnswersWithPoints.join(
                        ',',
                    )}' WHERE "id"=${id}`,
                );
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "acceptableAnswersWithPoints"`);
    }
}

function stringify(points: number, answer: string) {
    return `${points}:${answer}`;
}
