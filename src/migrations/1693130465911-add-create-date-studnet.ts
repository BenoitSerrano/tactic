import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreateDateStudnet1693130465911 implements MigrationInterface {
    name = 'AddCreateDateStudnet1693130465911';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "student" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "createdDate"`);
    }
}
