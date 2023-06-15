import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAttemptStudentExamUniqueConstraint1686841076197 implements MigrationInterface {
    name = 'AddAttemptStudentExamUniqueConstraint1686841076197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3f07048b321ff65cd4ca212fec"`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "One student has one shot for an exam" UNIQUE ("studentId", "examId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "One student has one shot for an exam"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3f07048b321ff65cd4ca212fec" ON "qcm_answer" ("questionChoixMultipleId", "attemptId") `);
    }

}
