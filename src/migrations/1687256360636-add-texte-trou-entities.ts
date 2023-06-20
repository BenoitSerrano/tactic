import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTexteTrouEntities1687256360636 implements MigrationInterface {
    name = 'AddTexteTrouEntities1687256360636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "texte_trou" ("id" SERIAL NOT NULL, "beforeText" character varying NOT NULL, "afterText" character varying NOT NULL, "acceptableAnswers" text NOT NULL, "rightAnswer" character varying NOT NULL, "order" integer NOT NULL, "examId" uuid, CONSTRAINT "PK_9a269c575dd0df426e87db3bd55" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "texte_trou_answer" ("id" SERIAL NOT NULL, "choice" integer NOT NULL, "texteTrouId" integer, "attemptId" uuid, CONSTRAINT "One answer corresponds to one texteTrou and one attempt" UNIQUE ("texteTrouId", "attemptId"), CONSTRAINT "PK_2c4e0c743375070cce326e7c370" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "texte_trou" ADD CONSTRAINT "FK_a71377c703343d20297a7e6c15c" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "texte_trou_answer" ADD CONSTRAINT "FK_98ecc1cf28f03a0bcabf07d783e" FOREIGN KEY ("texteTrouId") REFERENCES "texte_trou"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "texte_trou_answer" ADD CONSTRAINT "FK_5b0af9dfc74f599fe14e0d20fc6" FOREIGN KEY ("attemptId") REFERENCES "attempt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "texte_trou_answer" DROP CONSTRAINT "FK_5b0af9dfc74f599fe14e0d20fc6"`);
        await queryRunner.query(`ALTER TABLE "texte_trou_answer" DROP CONSTRAINT "FK_98ecc1cf28f03a0bcabf07d783e"`);
        await queryRunner.query(`ALTER TABLE "texte_trou" DROP CONSTRAINT "FK_a71377c703343d20297a7e6c15c"`);
        await queryRunner.query(`DROP TABLE "texte_trou_answer"`);
        await queryRunner.query(`DROP TABLE "texte_trou"`);
    }

}
