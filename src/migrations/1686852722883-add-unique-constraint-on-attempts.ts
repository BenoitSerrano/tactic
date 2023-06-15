import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueConstraintOnAttempts1686852722883 implements MigrationInterface {
    name = 'AddUniqueConstraintOnAttempts1686852722883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "startedAt"`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "One student has one shot for an exam" UNIQUE ("studentId", "examId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "One student has one shot for an exam"`);
        await queryRunner.query(`ALTER TABLE "student" ADD "startedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
