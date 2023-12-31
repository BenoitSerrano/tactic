import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeOrderQuestionFloat1703989194243 implements MigrationInterface {
    name = 'MakeOrderQuestionFloat1703989194243';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const questions = await queryRunner.query(`SELECT * FROM question`);

        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "order" double precision`);
        for (const question of questions) {
            await queryRunner.query(
                `UPDATE question SET "order"=${question.order} WHERE "id"=${question.id}`,
            );
        }
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "order" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const questions = await queryRunner.query(`SELECT * FROM question`);

        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "order" integer`);

        for (const question of questions) {
            await queryRunner.query(
                `UPDATE question SET "order"=${Math.round(question.order)} WHERE "id"=${
                    question.id
                }`,
            );
        }
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "order" SET NOT NULL`);
    }
}
