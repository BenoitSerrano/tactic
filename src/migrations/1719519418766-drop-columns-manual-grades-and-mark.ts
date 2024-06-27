import { MigrationInterface, QueryRunner } from "typeorm";

export class DropColumnsManualGradesAndMark1719519418766 implements MigrationInterface {
    name = 'DropColumnsManualGradesAndMark1719519418766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "marks"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "manualGrades"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" ADD "manualGrades" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD "marks" text NOT NULL DEFAULT ''`);
    }

}
