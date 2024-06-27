import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReduceSizeColumnsOrderPoints1719517744051 implements MigrationInterface {
    name = 'ReduceSizeColumnsOrderPoints1719517744051';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const questions = await queryRunner.query(`SELECT "id", "order", "points" FROM "question"`);
        for (const question of questions) {
            if (Math.floor(question.order) !== question.order) {
                throw new Error(`Error on question ${question.id}: order with decimal`);
            }
        }

        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "points"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "points" real NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "order" smallint NOT NULL DEFAULT '1'`);

        for (const question of questions) {
            await queryRunner.query(
                `UPDATE "question" SET "points"='${question.points}' WHERE "id"=${question.id}`,
            );
            await queryRunner.query(
                `UPDATE "question" SET "order"='${question.order}' WHERE "id"=${question.id}`,
            );
        }

        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "points" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "order" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const questions = await queryRunner.query(`SELECT "id", "order", "points" FROM "question"`);

        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "order"`);
        await queryRunner.query(
            `ALTER TABLE "question" ADD "order" double precision NOT NULL DEFAULT '1'`,
        );
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "points"`);
        await queryRunner.query(
            `ALTER TABLE "question" ADD "points" double precision NOT NULL DEFAULT '1'`,
        );

        for (const question of questions) {
            await queryRunner.query(
                `UPDATE "question" SET "points"='${question.points}' WHERE "id"=${question.id}`,
            );
            await queryRunner.query(
                `UPDATE "question" SET "order"='${question.order}' WHERE "id"=${question.id}`,
            );
        }

        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "points" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "order" DROP DEFAULT`);
    }
}
