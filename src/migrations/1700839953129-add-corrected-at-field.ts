import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCorrectedAtField1700839953129 implements MigrationInterface {
    name = 'AddCorrectedAtField1700839953129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" ADD "correctedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "correctedAt"`);
    }

}
