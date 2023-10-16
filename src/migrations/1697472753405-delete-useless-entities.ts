import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteUselessEntities1697472753405 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE public.phrase_melangee_answer;`);
        await queryRunner.query(`DROP TABLE public.question_trou_answer;`);
        await queryRunner.query(`DROP TABLE public.qcm_answer;`);
        await queryRunner.query(`DROP TABLE public.question_choix_multiple;`);
        await queryRunner.query(`DROP TABLE public.question_trou;`);
        await queryRunner.query(`DROP TABLE public.phrase_melangee;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE public.phrase_melangee_answer (
            id serial4 NOT NULL,
            "phraseMelangeeId" int4 NULL,
            "attemptId" uuid NULL,
            answer varchar NOT NULL,
            CONSTRAINT "One combination corresponds to one phraseMelangee and one attem" UNIQUE ("phraseMelangeeId", "attemptId"),
            CONSTRAINT "PK_52837952952c2a5cc0e71fe596a" PRIMARY KEY (id)
        );`);

        await queryRunner.query(
            `ALTER TABLE public.phrase_melangee_answer ADD CONSTRAINT "FK_0b471e0e8de756983e7aa18d4f1" FOREIGN KEY ("attemptId") REFERENCES public.attempt(id) ON DELETE CASCADE;`,
        );
        await queryRunner.query(
            `ALTER TABLE public.phrase_melangee_answer ADD CONSTRAINT "FK_5bbc207357a909525f9239614ba" FOREIGN KEY ("phraseMelangeeId") REFERENCES public.phrase_melangee(id) ON DELETE CASCADE;`,
        );
    }
}
