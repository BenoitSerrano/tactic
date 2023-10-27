import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteHasBeenTreated1698417998088 implements MigrationInterface {
    name = 'DeleteHasBeenTreated1698417998088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "hasBeenTreated"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" ADD "hasBeenTreated" boolean NOT NULL DEFAULT false`);
    }

}
