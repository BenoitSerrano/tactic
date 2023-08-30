import { MigrationInterface, QueryRunner } from "typeorm";

export class FixTypoInUnicityConstraint1693130602180 implements MigrationInterface {
    name = 'FixTypoInUnicityConstraint1693130602180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "phrase_melangee_answer" DROP CONSTRAINT "One combination corresponds to one phraseMelangee and one attem"`);
        await queryRunner.query(`ALTER TABLE "phrase_melangee_answer" ADD CONSTRAINT "One combination corresponds to one phraseMelangee and one attempt" UNIQUE ("phraseMelangeeId", "attemptId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "phrase_melangee_answer" DROP CONSTRAINT "One combination corresponds to one phraseMelangee and one attempt"`);
        await queryRunner.query(`ALTER TABLE "phrase_melangee_answer" ADD CONSTRAINT "One combination corresponds to one phraseMelangee and one attem" UNIQUE ("phraseMelangeeId", "attemptId")`);
    }

}
