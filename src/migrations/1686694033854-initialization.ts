import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialization1686694033854 implements MigrationInterface {
    name = 'Initialization1686694033854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exam" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_56071ab3a94aeac01f1b5ab74aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question_choix_multiple" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "order" integer NOT NULL, "possibleAnswers" text NOT NULL, "rightAnswerIndex" integer NOT NULL, CONSTRAINT "PK_f5a52f06f84525053b6f246b8dc" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "question_choix_multiple"`);
        await queryRunner.query(`DROP TABLE "exam"`);
    }

}
