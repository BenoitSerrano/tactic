import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveOrderConstraint1700600298550 implements MigrationInterface {
    name = 'RemoveOrderConstraint1700600298550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "Order is unique for each question of an exercise"`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "Order is unique for each exercise of an exam"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "Order is unique for each exercise of an exam" UNIQUE ("order", "examId")`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "Order is unique for each question of an exercise" UNIQUE ("order", "exerciseId")`);
    }

}
