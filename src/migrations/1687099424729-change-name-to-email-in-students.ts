import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeNameToEmailInStudents1687099424729 implements MigrationInterface {
    name = 'ChangeNameToEmailInStudents1687099424729';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "lastName"`);
        await queryRunner.query(
            `ALTER TABLE "student" ADD "email" character varying NOT NULL DEFAULT ''`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "email"`);
        await queryRunner.query(
            `ALTER TABLE "student" ADD "lastName" character varying NOT NULL DEFAULT ''`,
        );
        await queryRunner.query(
            `ALTER TABLE "student" ADD "firstName" character varying NOT NULL DEFAULT ''`,
        );
    }
}
