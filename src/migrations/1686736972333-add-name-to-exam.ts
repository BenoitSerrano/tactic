import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToExam1686736972333 implements MigrationInterface {
    name = 'AddNameToExam1686736972333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "name"`);
    }

}
