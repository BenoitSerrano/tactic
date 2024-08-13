import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlan1723439235304 implements MigrationInterface {
    name = 'AddPlan1723439235304';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."plan_name_enum" AS ENUM('FREE', 'UNLIMITED')`,
        );

        await queryRunner.query(
            `CREATE TABLE "plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."plan_name_enum" NOT NULL, "monthlyPrice" smallint NOT NULL, "annualPrice" smallint NOT NULL, "maxAttempts" smallint, "maxExams" smallint, CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`ALTER TABLE "user" ADD "planId" uuid`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_40f6ab3925c167d26e52db93cf0" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );

        await queryRunner.query(
            `INSERT INTO "plan" ("name", "monthlyPrice", "annualPrice") VALUES ('UNLIMITED', 10, 100) RETURNING id`,
        );
        const [insertedFreePlan] = await queryRunner.query(
            `INSERT INTO "plan" ("name", "monthlyPrice", "annualPrice", "maxAttempts", "maxExams") VALUES ('FREE', 0, 0, 40, 1) RETURNING id`,
        );

        await queryRunner.query(`UPDATE "user" SET "planId"='${insertedFreePlan.id}'`);
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "FK_40f6ab3925c167d26e52db93cf0"`,
        );
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "planId" SET NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_40f6ab3925c167d26e52db93cf0" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "plan" ADD CONSTRAINT "UQ_8aa73af67fa634d33de9bf874ab" UNIQUE ("name")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TYPE "public"."plan_name_enum"`);

        await queryRunner.query(
            `ALTER TABLE "plan" DROP CONSTRAINT "UQ_8aa73af67fa634d33de9bf874ab"`,
        );

        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "FK_40f6ab3925c167d26e52db93cf0"`,
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "planId"`);
        await queryRunner.query(`DROP TABLE "plan"`);
    }
}
