import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhraseMelangeeAnswer1689166095097 implements MigrationInterface {
    name = 'AddPhraseMelangeeAnswer1689166095097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "phrase_melangee_answer" ("id" SERIAL NOT NULL, "combination" text NOT NULL, "phraseMelangeeId" integer, "attemptId" uuid, CONSTRAINT "One combination corresponds to one phraseMelangee and one attempt" UNIQUE ("phraseMelangeeId", "attemptId"), CONSTRAINT "PK_52837952952c2a5cc0e71fe596a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "phrase_melangee_answer" ADD CONSTRAINT "FK_5bbc207357a909525f9239614ba" FOREIGN KEY ("phraseMelangeeId") REFERENCES "phrase_melangee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "phrase_melangee_answer" ADD CONSTRAINT "FK_0b471e0e8de756983e7aa18d4f1" FOREIGN KEY ("attemptId") REFERENCES "attempt"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "phrase_melangee_answer" DROP CONSTRAINT "FK_0b471e0e8de756983e7aa18d4f1"`);
        await queryRunner.query(`ALTER TABLE "phrase_melangee_answer" DROP CONSTRAINT "FK_5bbc207357a909525f9239614ba"`);
        await queryRunner.query(`DROP TABLE "phrase_melangee_answer"`);
    }

}
