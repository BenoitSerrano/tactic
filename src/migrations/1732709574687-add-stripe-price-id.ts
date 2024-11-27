import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStripePriceId1732709574687 implements MigrationInterface {
    name = 'AddStripePriceId1732709574687';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`TRUNCATE TABLE "package"`);
        await queryRunner.query(
            `ALTER TABLE "package" ADD "stripePriceId" character varying NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" DROP COLUMN "stripePriceId"`);
    }
}
