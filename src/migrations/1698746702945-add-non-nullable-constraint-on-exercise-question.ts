import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNonNullableConstraintOnExerciseQuestion1698746702945 implements MigrationInterface {
    name = 'AddNonNullableConstraintOnExerciseQuestion1698746702945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_77c4098703e8bdfab7997601ca9"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "Order is unique for each question of an exercise"`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "exerciseId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "FK_fd7cfed871a98e31023295893c5"`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "Order is unique for each exercise of an exam"`);
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "examId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "Order is unique for each question of an exercise" UNIQUE ("order", "exerciseId")`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "Order is unique for each exercise of an exam" UNIQUE ("order", "examId")`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_77c4098703e8bdfab7997601ca9" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "FK_fd7cfed871a98e31023295893c5" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "FK_fd7cfed871a98e31023295893c5"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_77c4098703e8bdfab7997601ca9"`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "Order is unique for each exercise of an exam"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "Order is unique for each question of an exercise"`);
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "examId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "Order is unique for each exercise of an exam" UNIQUE ("order", "examId")`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "FK_fd7cfed871a98e31023295893c5" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "exerciseId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "Order is unique for each question of an exercise" UNIQUE ("order", "exerciseId")`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_77c4098703e8bdfab7997601ca9" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
