import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConstraintUnicityOrderQuestionExercise1698699361706 implements MigrationInterface {
    name = 'AddConstraintUnicityOrderQuestionExercise1698699361706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "Order is unique for each question of an exercise" UNIQUE ("order", "exerciseId")`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "Order is unique for each exercise of an exam" UNIQUE ("order", "examId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "Order is unique for each exercise of an exam"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "Order is unique for each question of an exercise"`);
    }

}
