import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTreatedAtToAttempt1732808522431 implements MigrationInterface {
    name = 'AddTreatedAtToAttempt1732808522431';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" ADD "treatedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`UPDATE "attempt" SET "treatedAt"='2024-11-28 17:30:21.257 +0200'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "treatedAt"`);
    }
}
