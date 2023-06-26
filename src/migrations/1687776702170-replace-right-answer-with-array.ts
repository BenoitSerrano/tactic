import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceRightAnswerWithArray1687776702170 implements MigrationInterface {
    name = 'ReplaceRightAnswerWithArray1687776702170';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_trou" DROP COLUMN "rightAnswer"`);
        await queryRunner.query(
            `ALTER TABLE "question_trou" ADD "rightAnswers" text NOT NULL DEFAULT ''`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_trou" DROP COLUMN "rightAnswers"`);
        await queryRunner.query(
            `ALTER TABLE "question_trou" ADD "rightAnswer" character varying NOT NULL DEFAULT ''`,
        );
    }
}
