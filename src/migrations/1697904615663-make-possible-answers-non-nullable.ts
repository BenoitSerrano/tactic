import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakePossibleAnswersNonNullable1697904615663 implements MigrationInterface {
    name = 'MakePossibleAnswersNonNullable1697904615663';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "question" ALTER COLUMN "possibleAnswers" SET DEFAULT ''`,
        );
        await queryRunner.query(
            `UPDATE "question" SET "possibleAnswers"='' WHERE "possibleAnswers" IS NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "question" ALTER COLUMN "possibleAnswers" SET NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "question" ALTER COLUMN "possibleAnswers" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "question" ALTER COLUMN "possibleAnswers" DROP DEFAULT`,
        );
    }
}
