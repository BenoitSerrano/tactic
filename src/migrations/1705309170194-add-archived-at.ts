import { MigrationInterface, QueryRunner } from "typeorm";

export class AddArchivedAt1705309170194 implements MigrationInterface {
    name = 'AddArchivedAt1705309170194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" ADD "archivedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "archivedAt"`);
    }

}
