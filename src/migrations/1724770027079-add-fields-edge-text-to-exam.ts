import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsEdgeTextToExam1724770027079 implements MigrationInterface {
    name = 'AddFieldsEdgeTextToExam1724770027079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" ADD "startText" text`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "endText" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "endText"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "startText"`);
    }

}
