import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuestionTrouEntities1687257693344 implements MigrationInterface {
    name = 'AddQuestionTrouEntities1687257693344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "question_trou" ("id" SERIAL NOT NULL, "beforeText" character varying NOT NULL, "afterText" character varying NOT NULL, "acceptableAnswers" text NOT NULL, "rightAnswer" character varying NOT NULL, "order" integer NOT NULL, "examId" uuid, CONSTRAINT "PK_2e88328e1201352e021a77edcc1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question_trou_answer" ("id" SERIAL NOT NULL, "choice" integer NOT NULL, "questionTrouId" integer, "attemptId" uuid, CONSTRAINT "One answer corresponds to one questionTrou and one attempt" UNIQUE ("questionTrouId", "attemptId"), CONSTRAINT "PK_862b85e9b7b3846599ba03e0c6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "question_trou" ADD CONSTRAINT "FK_3e08fe1f53a2213a15c61ca8577" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_trou_answer" ADD CONSTRAINT "FK_069536faf9ca8d948c709db6255" FOREIGN KEY ("questionTrouId") REFERENCES "question_trou"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_trou_answer" ADD CONSTRAINT "FK_ee520480af46905d7f35912efba" FOREIGN KEY ("attemptId") REFERENCES "attempt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_trou_answer" DROP CONSTRAINT "FK_ee520480af46905d7f35912efba"`);
        await queryRunner.query(`ALTER TABLE "question_trou_answer" DROP CONSTRAINT "FK_069536faf9ca8d948c709db6255"`);
        await queryRunner.query(`ALTER TABLE "question_trou" DROP CONSTRAINT "FK_3e08fe1f53a2213a15c61ca8577"`);
        await queryRunner.query(`DROP TABLE "question_trou_answer"`);
        await queryRunner.query(`DROP TABLE "question_trou"`);
    }

}
