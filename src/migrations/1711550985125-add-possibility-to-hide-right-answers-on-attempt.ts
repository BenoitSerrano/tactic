import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPossibilityToHideRightAnswersOnAttempt1711550985125 implements MigrationInterface {
    name = 'AddPossibilityToHideRightAnswersOnAttempt1711550985125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" ADD "shouldDisplayRightAnswers" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "shouldDisplayRightAnswers"`);
    }

}
