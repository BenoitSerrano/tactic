import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteCommentsInUser1719516819571 implements MigrationInterface {
    name = 'DeleteCommentsInUser1719516819571';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "comments"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" ADD "comments" text NOT NULL DEFAULT ''`);
    }
}
