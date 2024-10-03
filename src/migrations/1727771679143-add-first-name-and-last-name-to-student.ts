import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFirstNameAndLastNameToStudent1727771679143 implements MigrationInterface {
    name = 'AddFirstNameAndLastNameToStudent1727771679143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ADD "firstName" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "student" ADD "lastName" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "firstName"`);
    }

}
