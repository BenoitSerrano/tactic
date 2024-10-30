import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceRoleWithRoles1730315189769 implements MigrationInterface {
    name = 'ReplaceRoleWithRoles1730315189769';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "roles" text NOT NULL DEFAULT 'teacher'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."user_role_enum" AS ENUM('teacher', 'admin')`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'teacher'`,
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
    }
}
