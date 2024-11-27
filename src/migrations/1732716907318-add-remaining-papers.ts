import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRemainingPapers1732716907318 implements MigrationInterface {
    name = 'AddRemainingPapers1732716907318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "remainingPapers" integer NOT NULL DEFAULT '20'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "remainingPapers"`);
    }

}
