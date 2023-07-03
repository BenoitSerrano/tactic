import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteAttemptOnCascade1688393657160 implements MigrationInterface {
    name = 'DeleteAttemptOnCascade1688393657160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_trou_answer" DROP CONSTRAINT "FK_ee520480af46905d7f35912efba"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_06e63ae64f3874fe2645d11f9b6"`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" DROP CONSTRAINT "FK_05f389f80c4e35e5a0a1bd9760c"`);
        await queryRunner.query(`ALTER TABLE "question_trou_answer" ADD CONSTRAINT "FK_ee520480af46905d7f35912efba" FOREIGN KEY ("attemptId") REFERENCES "attempt"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "FK_06e63ae64f3874fe2645d11f9b6" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" ADD CONSTRAINT "FK_05f389f80c4e35e5a0a1bd9760c" FOREIGN KEY ("attemptId") REFERENCES "attempt"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qcm_answer" DROP CONSTRAINT "FK_05f389f80c4e35e5a0a1bd9760c"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_06e63ae64f3874fe2645d11f9b6"`);
        await queryRunner.query(`ALTER TABLE "question_trou_answer" DROP CONSTRAINT "FK_ee520480af46905d7f35912efba"`);
        await queryRunner.query(`ALTER TABLE "qcm_answer" ADD CONSTRAINT "FK_05f389f80c4e35e5a0a1bd9760c" FOREIGN KEY ("attemptId") REFERENCES "attempt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "FK_06e63ae64f3874fe2645d11f9b6" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_trou_answer" ADD CONSTRAINT "FK_ee520480af46905d7f35912efba" FOREIGN KEY ("attemptId") REFERENCES "attempt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
