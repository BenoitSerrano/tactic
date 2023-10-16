import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteConstraintUniquenessOrder1697472089493 implements MigrationInterface {
    name = 'DeleteConstraintUniquenessOrder1697472089493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "The order for a question is unique inside an exam"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "The order for a question is unique inside an exam" UNIQUE ("order", "examId")`);
    }

}
