import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteExamReferenceInQuestion1698087902201 implements MigrationInterface {
    name = 'DeleteExamReferenceInQuestion1698087902201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_286bbf761d3af4e2fcac4a634d5"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "examId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ADD "examId" uuid`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_286bbf761d3af4e2fcac4a634d5" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
