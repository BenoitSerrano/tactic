import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniquenessToStudent1693041951555 implements MigrationInterface {
    name = 'AddUniquenessToStudent1693041951555';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "student" DROP CONSTRAINT "UQ_a56c051c91dbe1068ad683f536e"`,
        );
        await queryRunner.query(
            `ALTER TABLE "student" ADD CONSTRAINT "Students are unique by teacher" UNIQUE ("email", "userId")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "student" DROP CONSTRAINT "Students are unique by teacher"`,
        );
        await queryRunner.query(
            `ALTER TABLE "student" ADD CONSTRAINT "UQ_a56c051c91dbe1068ad683f536e" UNIQUE ("email")`,
        );
    }
}
