import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPointsToQuestions1687865261817 implements MigrationInterface {
    name = 'AddPointsToQuestions1687865261817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_choix_multiple" ADD "points" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "question_trou" ADD "points" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "question_trou" ALTER COLUMN "acceptableAnswers" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_trou" ALTER COLUMN "acceptableAnswers" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "question_trou" DROP COLUMN "points"`);
        await queryRunner.query(`ALTER TABLE "question_choix_multiple" DROP COLUMN "points"`);
    }

}
