import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTexteLibreQuestionKind1697898013245 implements MigrationInterface {
    name = 'AddTexteLibreQuestionKind1697898013245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."question_kind_enum" RENAME TO "question_kind_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."question_kind_enum" AS ENUM('qcm', 'questionTrou', 'phraseMelangee', 'texteLibre')`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "kind" TYPE "public"."question_kind_enum" USING "kind"::"text"::"public"."question_kind_enum"`);
        await queryRunner.query(`DROP TYPE "public"."question_kind_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."question_kind_enum_old" AS ENUM('qcm', 'questionTrou', 'phraseMelangee')`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "kind" TYPE "public"."question_kind_enum_old" USING "kind"::"text"::"public"."question_kind_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."question_kind_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."question_kind_enum_old" RENAME TO "question_kind_enum"`);
    }

}
