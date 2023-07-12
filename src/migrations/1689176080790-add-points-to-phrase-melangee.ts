import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPointsToPhraseMelangee1689176080790 implements MigrationInterface {
    name = 'AddPointsToPhraseMelangee1689176080790';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "phrase_melangee" ADD "points" double precision NOT NULL DEFAULT '1'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "phrase_melangee" DROP COLUMN "points"`);
    }
}
