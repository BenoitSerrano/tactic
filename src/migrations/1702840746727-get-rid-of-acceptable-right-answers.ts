import { MigrationInterface, QueryRunner } from "typeorm";

export class GetRidOfAcceptableRightAnswers1702840746727 implements MigrationInterface {
    name = 'GetRidOfAcceptableRightAnswers1702840746727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "acceptableAnswers"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "rightAnswers"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ADD "rightAnswers" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "question" ADD "acceptableAnswers" text NOT NULL DEFAULT ''`);
    }

}
