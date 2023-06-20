import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceChoiceWithAnswer1687291459297 implements MigrationInterface {
    name = 'ReplaceChoiceWithAnswer1687291459297';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_trou_answer" DROP COLUMN "choice"`);
        await queryRunner.query(
            `ALTER TABLE "question_trou_answer" ADD "answer" character varying NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_trou_answer" DROP COLUMN "answer"`);
        await queryRunner.query(`ALTER TABLE "question_trou_answer" ADD "choice" integer NOT NULL`);
    }
}
