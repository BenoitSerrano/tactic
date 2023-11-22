import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveResourceFromExercise1700659535448 implements MigrationInterface {
    name = 'RemoveResourceFromExercise1700659535448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "resourceUrl"`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "resourceKind"`);
        await queryRunner.query(`DROP TYPE "public"."exercise_resourcekind_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."exercise_resourcekind_enum" AS ENUM('NONE', 'IMG')`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD "resourceKind" "public"."exercise_resourcekind_enum" NOT NULL DEFAULT 'NONE'`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD "resourceUrl" character varying`);
    }

}
