import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteArchivedAt1731245390566 implements MigrationInterface {
    name = 'DeleteArchivedAt1731245390566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "archivedAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" ADD "archivedAt" TIMESTAMP WITH TIME ZONE`);
    }

}
