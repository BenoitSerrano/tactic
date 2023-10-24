import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultPointsToExercise1698142164524 implements MigrationInterface {
    name = 'AddDefaultPointsToExercise1698142164524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" ADD "defaultPoints" double precision NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "defaultPoints"`);
    }

}
