import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUnicityToStudent1690484223049 implements MigrationInterface {
    name = 'AddUnicityToStudent1690484223049';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "student" ADD CONSTRAINT "UQ_a56c051c91dbe1068ad683f536e" UNIQUE ("email")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "student" DROP CONSTRAINT "UQ_a56c051c91dbe1068ad683f536e"`,
        );
    }
}
