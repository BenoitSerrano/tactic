import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEndedAtColumnForAttempt1687196669482 implements MigrationInterface {
    name = 'AddEndedAtColumnForAttempt1687196669482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" ADD "endedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "endedAt"`);
    }

}
