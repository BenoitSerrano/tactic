import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameQuestionTrou1702724636794 implements MigrationInterface {
    name = 'RenameQuestionTrou1702724636794';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TYPE "public"."question_kind_enum" RENAME TO "question_kind_enum_old"`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."question_kind_enum" AS ENUM('qcm', 'questionReponse', 'questionTrou', 'phraseMelangee', 'texteLibre', 'texteATrous')`,
        );
        await queryRunner.query(
            `ALTER TABLE "question" ALTER COLUMN "kind" TYPE "public"."question_kind_enum" USING "kind"::"text"::"public"."question_kind_enum"`,
        );
        await queryRunner.query(`DROP TYPE "public"."question_kind_enum_old"`);
        await queryRunner.query(
            `ALTER TYPE "public"."exercise_defaultquestionkind_enum" RENAME TO "exercise_defaultquestionkind_enum_old"`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."exercise_defaultquestionkind_enum" AS ENUM('qcm', 'questionReponse', 'questionTrou', 'phraseMelangee', 'texteLibre', 'texteATrous')`,
        );
        await queryRunner.query(
            `ALTER TABLE "exercise" ALTER COLUMN "defaultQuestionKind" TYPE "public"."exercise_defaultquestionkind_enum" USING "defaultQuestionKind"::"text"::"public"."exercise_defaultquestionkind_enum"`,
        );
        await queryRunner.query(`DROP TYPE "public"."exercise_defaultquestionkind_enum_old"`);
        await queryRunner.query(
            `UPDATE "question" SET "kind"='questionReponse' WHERE "kind"='questionTrou'`,
        );
        await queryRunner.query(
            `UPDATE "exercise" SET "defaultQuestionKind"='questionReponse' WHERE "defaultQuestionKind"='questionTrou'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `UPDATE "question SET "kind"='questionTrou' WHERE "kind"='questionReponse'`,
        );
        await queryRunner.query(
            `UPDATE "exercise SET "defaultQuestionKind"='questionTrou' WHERE "defaultQuestionKind"='questionReponse'`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."exercise_defaultquestionkind_enum_old" AS ENUM('qcm', 'questionTrou', 'phraseMelangee', 'texteLibre', 'texteATrous')`,
        );
        await queryRunner.query(
            `ALTER TABLE "exercise" ALTER COLUMN "defaultQuestionKind" TYPE "public"."exercise_defaultquestionkind_enum_old" USING "defaultQuestionKind"::"text"::"public"."exercise_defaultquestionkind_enum_old"`,
        );
        await queryRunner.query(`DROP TYPE "public"."exercise_defaultquestionkind_enum"`);
        await queryRunner.query(
            `ALTER TYPE "public"."exercise_defaultquestionkind_enum_old" RENAME TO "exercise_defaultquestionkind_enum"`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."question_kind_enum_old" AS ENUM('qcm', 'questionTrou', 'phraseMelangee', 'texteLibre', 'texteATrous')`,
        );
        await queryRunner.query(
            `ALTER TABLE "question" ALTER COLUMN "kind" TYPE "public"."question_kind_enum_old" USING "kind"::"text"::"public"."question_kind_enum_old"`,
        );
        await queryRunner.query(`DROP TYPE "public"."question_kind_enum"`);
        await queryRunner.query(
            `ALTER TYPE "public"."question_kind_enum_old" RENAME TO "question_kind_enum"`,
        );
    }
}
