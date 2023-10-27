import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEndedAtToAttempt1698420492855 implements MigrationInterface {
    name = 'AddEndedAtToAttempt1698420492855';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" ADD "endedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`UPDATE "attempt" SET "endedAt"='2023-10-27 17:30:21.257 +0200'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "endedAt"`);
    }
}
