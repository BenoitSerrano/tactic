import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStudentAttempt1686761301276 implements MigrationInterface {
    name = 'AddStudentAttempt1686761301276';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "student" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL DEFAULT '', "lastName" character varying NOT NULL DEFAULT '', "startedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "attempt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "studentId" uuid, "examId" uuid, CONSTRAINT "PK_5f822b29b3128d1c65d3d6c193d" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "qcm_answer" ("id" SERIAL NOT NULL, "choice" integer NOT NULL, "questionChoixMultipleId" integer, CONSTRAINT "PK_ddde46c926832025fad77ed8aa3" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "attempt" ADD CONSTRAINT "FK_06e63ae64f3874fe2645d11f9b6" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "attempt" ADD CONSTRAINT "FK_65b233eb9155519df0f7255d20e" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "qcm_answer" ADD CONSTRAINT "FK_29160a860c16e5062cb3fca9836" FOREIGN KEY ("questionChoixMultipleId") REFERENCES "question_choix_multiple"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "qcm_answer" DROP CONSTRAINT "FK_29160a860c16e5062cb3fca9836"`,
        );
        await queryRunner.query(
            `ALTER TABLE "attempt" DROP CONSTRAINT "FK_65b233eb9155519df0f7255d20e"`,
        );
        await queryRunner.query(
            `ALTER TABLE "attempt" DROP CONSTRAINT "FK_06e63ae64f3874fe2645d11f9b6"`,
        );
        await queryRunner.query(`DROP TABLE "qcm_answer"`);
        await queryRunner.query(`DROP TABLE "attempt"`);
        await queryRunner.query(`DROP TABLE "student"`);
    }
}
