import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameEndedAtForAttempt1688730873551 implements MigrationInterface {
    name = 'RenameEndedAtForAttempt1688730873551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" RENAME COLUMN "endedAt" TO "updatedAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" RENAME COLUMN "updatedAt" TO "endedAt"`);
    }

}
