import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameToAcceptableAnswers1703260678229 implements MigrationInterface {
    name = 'RenameToAcceptableAnswers1703260678229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" RENAME COLUMN "acceptableAnswersWithPoints" TO "acceptableAnswers"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" RENAME COLUMN "acceptableAnswers" TO "acceptableAnswersWithPoints"`);
    }

}
