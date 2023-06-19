import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDurationExam1687196852602 implements MigrationInterface {
    name = 'AddDurationExam1687196852602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" ADD "duration" integer NOT NULL DEFAULT '15'`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "extraTime" integer NOT NULL DEFAULT '2'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "extraTime"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "duration"`);
    }

}
