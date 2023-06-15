import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQcmAnswersLinkToAttempt1686829307259 implements MigrationInterface {
    name = 'AddQcmAnswersLinkToAttempt1686829307259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qcm_answer" ADD "attemptId" uuid`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" ADD CONSTRAINT "FK_05f389f80c4e35e5a0a1bd9760c" FOREIGN KEY ("attemptId") REFERENCES "attempt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qcm_answer" DROP CONSTRAINT "FK_05f389f80c4e35e5a0a1bd9760c"`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" DROP COLUMN "attemptId"`);
    }

}
