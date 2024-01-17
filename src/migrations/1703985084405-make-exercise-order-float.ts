import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeExerciseOrderFloat1703985084405 implements MigrationInterface {
    name = 'MakeExerciseOrderFloat1703985084405';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const exercises = await queryRunner.query(`SELECT * FROM exercise`);

        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD "order" double precision`);
        for (const exercise of exercises) {
            await queryRunner.query(
                `UPDATE exercise SET "order"=${exercise.order} WHERE "id"=${exercise.id}`,
            );
        }
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "order" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const exercises = await queryRunner.query(`SELECT * FROM exercise`);

        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD "order" integer`);
        for (const exercise of exercises) {
            await queryRunner.query(
                `UPDATE exercise SET "order"=${Math.round(exercise.order)} WHERE "id"=${
                    exercise.id
                }`,
            );
        }
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "order" SET NOT NULL`);
    }
}
