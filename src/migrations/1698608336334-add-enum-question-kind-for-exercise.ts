import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEnumQuestionKindForExercise1698608336334 implements MigrationInterface {
    name = 'AddEnumQuestionKindForExercise1698608336334';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."exercise_defaultquestionkind_enum" AS ENUM('qcm', 'questionTrou', 'phraseMelangee', 'texteLibre', 'texteATrous')`,
        );
        await queryRunner.query(
            `ALTER TABLE "exercise" ADD "defaultQuestionKind" "public"."exercise_defaultquestionkind_enum"`,
        );
        const exercises = await queryRunner.query(`SELECT id FROM exercise`);
        for (const exercise of exercises) {
            const questions = await queryRunner.query(`SELECT id, "kind" FROM question`);
            let defaultQuestionKind = 'qcm';
            if (questions.length) {
                defaultQuestionKind = questions[0].kind;
            }
            await queryRunner.query(
                `UPDATE exercise SET "defaultQuestionKind"='${defaultQuestionKind}' WHERE "id"=${exercise.id}`,
            );
        }

        await queryRunner.query(
            `ALTER TABLE "exercise" ALTER COLUMN "defaultQuestionKind" SET NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "defaultQuestionKind"`);
        await queryRunner.query(`DROP TYPE "public"."exercise_defaultquestionkind_enum"`);
    }
}
