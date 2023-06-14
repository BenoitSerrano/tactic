import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQcmRelations1686731812288 implements MigrationInterface {
    name = 'AddQcmRelations1686731812288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_choix_multiple" ADD "examId" uuid`);
        await queryRunner.query(`ALTER TABLE "question_choix_multiple" ADD CONSTRAINT "FK_6e736ab2551b4dd415cbd238e0b" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_choix_multiple" DROP CONSTRAINT "FK_6e736ab2551b4dd415cbd238e0b"`);
        await queryRunner.query(`ALTER TABLE "question_choix_multiple" DROP COLUMN "examId"`);
    }

}
