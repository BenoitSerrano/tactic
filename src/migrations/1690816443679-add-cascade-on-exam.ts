import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCascadeOnExam1690816443679 implements MigrationInterface {
    name = 'AddCascadeOnExam1690816443679';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "question_choix_multiple" DROP CONSTRAINT "FK_6e736ab2551b4dd415cbd238e0b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "qcm_answer" DROP CONSTRAINT "FK_29160a860c16e5062cb3fca9836"`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_trou" DROP CONSTRAINT "FK_3e08fe1f53a2213a15c61ca8577"`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_trou_answer" DROP CONSTRAINT "FK_069536faf9ca8d948c709db6255"`,
        );
        await queryRunner.query(
            `ALTER TABLE "attempt" DROP CONSTRAINT "FK_65b233eb9155519df0f7255d20e"`,
        );
        await queryRunner.query(
            `ALTER TABLE "phrase_melangee" DROP CONSTRAINT "FK_c38b3c68c07bbc21d93d2131011"`,
        );
        await queryRunner.query(
            `ALTER TABLE "phrase_melangee_answer" DROP CONSTRAINT "FK_5bbc207357a909525f9239614ba"`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_choix_multiple" ADD CONSTRAINT "FK_6e736ab2551b4dd415cbd238e0b" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "qcm_answer" ADD CONSTRAINT "FK_29160a860c16e5062cb3fca9836" FOREIGN KEY ("questionChoixMultipleId") REFERENCES "question_choix_multiple"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_trou" ADD CONSTRAINT "FK_3e08fe1f53a2213a15c61ca8577" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_trou_answer" ADD CONSTRAINT "FK_069536faf9ca8d948c709db6255" FOREIGN KEY ("questionTrouId") REFERENCES "question_trou"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "attempt" ADD CONSTRAINT "FK_65b233eb9155519df0f7255d20e" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "phrase_melangee" ADD CONSTRAINT "FK_c38b3c68c07bbc21d93d2131011" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "phrase_melangee_answer" ADD CONSTRAINT "FK_5bbc207357a909525f9239614ba" FOREIGN KEY ("phraseMelangeeId") REFERENCES "phrase_melangee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "phrase_melangee_answer" DROP CONSTRAINT "FK_5bbc207357a909525f9239614ba"`,
        );
        await queryRunner.query(
            `ALTER TABLE "phrase_melangee" DROP CONSTRAINT "FK_c38b3c68c07bbc21d93d2131011"`,
        );
        await queryRunner.query(
            `ALTER TABLE "attempt" DROP CONSTRAINT "FK_65b233eb9155519df0f7255d20e"`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_trou_answer" DROP CONSTRAINT "FK_069536faf9ca8d948c709db6255"`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_trou" DROP CONSTRAINT "FK_3e08fe1f53a2213a15c61ca8577"`,
        );
        await queryRunner.query(
            `ALTER TABLE "qcm_answer" DROP CONSTRAINT "FK_29160a860c16e5062cb3fca9836"`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_choix_multiple" DROP CONSTRAINT "FK_6e736ab2551b4dd415cbd238e0b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "phrase_melangee_answer" ADD CONSTRAINT "FK_5bbc207357a909525f9239614ba" FOREIGN KEY ("phraseMelangeeId") REFERENCES "phrase_melangee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "phrase_melangee" ADD CONSTRAINT "FK_c38b3c68c07bbc21d93d2131011" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "attempt" ADD CONSTRAINT "FK_65b233eb9155519df0f7255d20e" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_trou_answer" ADD CONSTRAINT "FK_069536faf9ca8d948c709db6255" FOREIGN KEY ("questionTrouId") REFERENCES "question_trou"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_trou" ADD CONSTRAINT "FK_3e08fe1f53a2213a15c61ca8577" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "qcm_answer" ADD CONSTRAINT "FK_29160a860c16e5062cb3fca9836" FOREIGN KEY ("questionChoixMultipleId") REFERENCES "question_choix_multiple"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "question_choix_multiple" ADD CONSTRAINT "FK_6e736ab2551b4dd415cbd238e0b" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
