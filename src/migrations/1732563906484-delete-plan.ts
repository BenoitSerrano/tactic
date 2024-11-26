import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeletePlan1732563906484 implements MigrationInterface {
    name = 'DeletePlan1732563906484';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "FK_40f6ab3925c167d26e52db93cf0"`,
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "planId"`);

        await queryRunner.query(
            `ALTER TABLE "plan" DROP CONSTRAINT "UQ_8aa73af67fa634d33de9bf874ab"`,
        );

        await queryRunner.query(`DROP TABLE "plan"`);
        await queryRunner.query(`DROP TYPE "public"."plan_name_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "planId" uuid NOT NULL`);

        await queryRunner.query(
            `CREATE TYPE "public"."plan_name_enum" AS ENUM('FREE', 'UNLIMITED')`,
        );

        await queryRunner.query(
            `CREATE TABLE "plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."plan_name_enum" NOT NULL, "monthlyPrice" smallint NOT NULL, "annualPrice" smallint NOT NULL, "maxAttempts" smallint, "maxExams" smallint, CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "plan" ADD CONSTRAINT "UQ_8aa73af67fa634d33de9bf874ab" UNIQUE ("name")`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_40f6ab3925c167d26e52db93cf0" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
