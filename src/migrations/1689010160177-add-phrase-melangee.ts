import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhraseMelangee1689010160177 implements MigrationInterface {
    name = 'AddPhraseMelangee1689010160177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "phrase_melangee" ("id" SERIAL NOT NULL, "words" text NOT NULL, "rightCombination" text NOT NULL, "order" integer NOT NULL, "examId" uuid, CONSTRAINT "PK_d5384e5b101300d03556d76faac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "phrase_melangee" ADD CONSTRAINT "FK_c38b3c68c07bbc21d93d2131011" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "phrase_melangee" DROP CONSTRAINT "FK_c38b3c68c07bbc21d93d2131011"`);
        await queryRunner.query(`DROP TABLE "phrase_melangee"`);
    }

}
