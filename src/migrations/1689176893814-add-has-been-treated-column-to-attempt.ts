import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHasBeenTreatedColumnToAttempt1689176893814 implements MigrationInterface {
    name = 'AddHasBeenTreatedColumnToAttempt1689176893814';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "attempt" ADD "hasBeenTreated" boolean NOT NULL DEFAULT false`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "hasBeenTreated"`);
    }
}
