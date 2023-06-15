import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQcmAnswersUniqueConstraint1686832192824 implements MigrationInterface {
    name = 'AddQcmAnswersUniqueConstraint1686832192824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qcm_answer" ADD CONSTRAINT "One answer corresponds to one question and one attempt" UNIQUE ("questionChoixMultipleId", "attemptId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qcm_answer" DROP CONSTRAINT "One answer corresponds to one question and one attempt"`);
    }

}
