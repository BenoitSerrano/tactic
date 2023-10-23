import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExercise1698068723922 implements MigrationInterface {
    name = 'AddExercise1698068723922';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "exercise" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "instruction" character varying NOT NULL, "order" integer NOT NULL, "examId" uuid, CONSTRAINT "PK_a0f107e3a2ef2742c1e91d97c14" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`ALTER TABLE "question" ADD "exerciseId" integer`);
        await queryRunner.query(
            `ALTER TABLE "exercise" ADD CONSTRAINT "FK_fd7cfed871a98e31023295893c5" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "question" ADD CONSTRAINT "FK_77c4098703e8bdfab7997601ca9" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        const exams = await queryRunner.query(`SELECT * FROM "exam"`);
        for (const exam of exams) {
            const examId = exam.id;
            const result: Array<{ id: number }> = await queryRunner.query(
                `INSERT INTO "exercise" ("name", "instruction", "order", "examId") VALUES ('Exercise sans nom', '', 1, '${examId}') RETURNING id`,
            );
            const exerciseId = result[0].id;
            await queryRunner.query(
                `UPDATE "question" SET "exerciseId"=${exerciseId} WHERE "examId"='${examId}'`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const exercises = await queryRunner.query(`SELECT * FROM "exercise"`);
        for (const exercise of exercises) {
            const examId = exercise.examId;
            await queryRunner.query(
                `UPDATE "question" SET "examId"='${examId}' WHERE "exerciseId"=${exercise.id}`,
            );
        }
        await queryRunner.query(
            `ALTER TABLE "question" DROP CONSTRAINT "FK_77c4098703e8bdfab7997601ca9"`,
        );
        await queryRunner.query(
            `ALTER TABLE "exercise" DROP CONSTRAINT "FK_fd7cfed871a98e31023295893c5"`,
        );
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "exerciseId"`);
        await queryRunner.query(`DROP TABLE "exercise"`);
    }
}
