import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPackage1732639590714 implements MigrationInterface {
    name = 'AddPackage1732639590714';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "package" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" integer NOT NULL, "paperCount" smallint NOT NULL, "stripeProductId" character varying NOT NULL, CONSTRAINT "PK_308364c66df656295bc4ec467c2" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "package"`);
    }
}
