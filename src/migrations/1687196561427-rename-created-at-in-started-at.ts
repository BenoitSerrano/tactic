import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameCreatedAtInStartedAt1687196561427 implements MigrationInterface {
    name = 'RenameCreatedAtInStartedAt1687196561427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" RENAME COLUMN "createdAt" TO "startedAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" RENAME COLUMN "startedAt" TO "createdAt"`);
    }

}
