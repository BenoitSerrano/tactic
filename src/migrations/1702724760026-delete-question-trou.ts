import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteQuestionTrou1702724760026 implements MigrationInterface {
    name = 'DeleteQuestionTrou1702724760026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."question_kind_enum" RENAME TO "question_kind_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."question_kind_enum" AS ENUM('qcm', 'questionReponse', 'phraseMelangee', 'texteLibre', 'texteATrous')`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "kind" TYPE "public"."question_kind_enum" USING "kind"::"text"::"public"."question_kind_enum"`);
        await queryRunner.query(`DROP TYPE "public"."question_kind_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."exercise_defaultquestionkind_enum" RENAME TO "exercise_defaultquestionkind_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."exercise_defaultquestionkind_enum" AS ENUM('qcm', 'questionReponse', 'phraseMelangee', 'texteLibre', 'texteATrous')`);
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "defaultQuestionKind" TYPE "public"."exercise_defaultquestionkind_enum" USING "defaultQuestionKind"::"text"::"public"."exercise_defaultquestionkind_enum"`);
        await queryRunner.query(`DROP TYPE "public"."exercise_defaultquestionkind_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."exercise_defaultquestionkind_enum_old" AS ENUM('qcm', 'questionReponse', 'questionTrou', 'phraseMelangee', 'texteLibre', 'texteATrous')`);
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "defaultQuestionKind" TYPE "public"."exercise_defaultquestionkind_enum_old" USING "defaultQuestionKind"::"text"::"public"."exercise_defaultquestionkind_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."exercise_defaultquestionkind_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."exercise_defaultquestionkind_enum_old" RENAME TO "exercise_defaultquestionkind_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."question_kind_enum_old" AS ENUM('qcm', 'questionReponse', 'questionTrou', 'phraseMelangee', 'texteLibre', 'texteATrous')`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "kind" TYPE "public"."question_kind_enum_old" USING "kind"::"text"::"public"."question_kind_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."question_kind_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."question_kind_enum_old" RENAME TO "question_kind_enum"`);
    }

}
