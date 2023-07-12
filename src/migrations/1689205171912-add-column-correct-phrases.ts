import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnCorrectPhrases1689205171912 implements MigrationInterface {
    name = 'AddColumnCorrectPhrases1689205171912';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "phrase_melangee" DROP COLUMN "shuffledCombination"`);
        await queryRunner.query(
            `ALTER TABLE "phrase_melangee" ADD "correctPhrases" text NOT NULL DEFAULT ''`,
        );
        await queryRunner.query(
            `ALTER TABLE "phrase_melangee" ADD "shuffledPhrase" character varying NOT NULL DEFAULT ''`,
        );
        await queryRunner.query(`ALTER TABLE "phrase_melangee_answer" DROP COLUMN "combination"`);
        await queryRunner.query(
            `ALTER TABLE "phrase_melangee_answer" ADD "answer" character varying NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "phrase_melangee_answer" DROP COLUMN "answer"`);
        await queryRunner.query(
            `ALTER TABLE "phrase_melangee_answer" ADD "combination" text NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE "phrase_melangee" DROP COLUMN "shuffledPhrase"`);
        await queryRunner.query(`ALTER TABLE "phrase_melangee" DROP COLUMN "correctPhrases"`);
        await queryRunner.query(
            `ALTER TABLE "phrase_melangee" ADD "shuffledCombination" text NOT NULL`,
        );
    }
}
