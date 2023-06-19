import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTimestampToTimestampts1687207472553 implements MigrationInterface {
    name = 'ChangeTimestampToTimestampts1687207472553';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "startedAt"`);
        await queryRunner.query(
            `ALTER TABLE "attempt" ADD "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
        );
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "endedAt"`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD "endedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "endedAt"`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD "endedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "startedAt"`);
        await queryRunner.query(
            `ALTER TABLE "attempt" ADD "startedAt" TIMESTAMP NOT NULL DEFAULT now()`,
        );
    }
}
