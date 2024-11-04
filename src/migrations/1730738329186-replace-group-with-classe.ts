import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceGroupWithClasse1730738329186 implements MigrationInterface {
    name = 'ReplaceGroupWithClasse1730738329186';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" RENAME TO "classe"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classe" RENAME TO "group"`);
    }
}
