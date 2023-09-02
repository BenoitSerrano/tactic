import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCheatingSummary1693602014837 implements MigrationInterface {
    name = 'AddCheatingSummary1693602014837';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "attempt" ADD "roundTrips" integer NOT NULL DEFAULT '0'`,
        );
        await queryRunner.query(
            `ALTER TABLE "attempt" ADD "timeSpentOutside" integer NOT NULL DEFAULT '0'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "timeSpentOutside"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "roundTrips"`);
    }
}
