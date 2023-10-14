import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestionEntity1697208383373 implements MigrationInterface {
    name = 'AddQuestionEntity1697208383373';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."question_kind_enum" AS ENUM('qcm', 'questionTrou', 'phraseMelangee')`,
        );
        await queryRunner.query(
            `CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "kind" "public"."question_kind_enum" NOT NULL, "title" character varying NOT NULL, "points" double precision NOT NULL, "acceptableAnswers" text NOT NULL DEFAULT '', "rightAnswers" text NOT NULL DEFAULT '', "order" integer NOT NULL, "possibleAnswers" text, "examId" uuid, CONSTRAINT "The order for a question is unique inside an exam" UNIQUE ("order", "examId"), CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
        );

        await queryRunner.query(
            `ALTER TABLE "question" ADD CONSTRAINT "FK_286bbf761d3af4e2fcac4a634d5" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );

        const qcms = await queryRunner.query(
            `SELECT * FROM question_choix_multiple ORDER BY "order";`,
        );
        const phrasesMelangees = await queryRunner.query(
            `SELECT * FROM phrase_melangee ORDER BY "order";`,
        );
        const questionsTrou = await queryRunner.query(
            `SELECT * FROM question_trou ORDER BY "order";`,
        );

        const questions = [];
        const columns = [
            'kind',
            'title',
            'points',
            'acceptableAnswers',
            'rightAnswers',
            'order',
            'possibleAnswers',
            'examId',
        ];
        const grouppedQuestions: Record<
            string,
            {
                qcms: any[];
                questionsTrou: any[];
                phrasesMelangees: any[];
            }
        > = {};
        qcms.forEach((qcm: any) => {
            grouppedQuestions[qcm.examId] = grouppedQuestions[qcm.examId]
                ? {
                      ...grouppedQuestions[qcm.examId],
                      qcms: [...grouppedQuestions[qcm.examId].qcms, qcm],
                  }
                : { qcms: [qcm], questionsTrou: [], phrasesMelangees: [] };
        });
        questionsTrou.forEach((questionTrou: any) => {
            grouppedQuestions[questionTrou.examId] = grouppedQuestions[questionTrou.examId]
                ? {
                      ...grouppedQuestions[questionTrou.examId],
                      questionsTrou: [
                          ...grouppedQuestions[questionTrou.examId].questionsTrou,
                          questionTrou,
                      ],
                  }
                : { questionsTrou: [questionTrou], qcms: [], phrasesMelangees: [] };
        });
        phrasesMelangees.forEach((phraseMelangee: any) => {
            grouppedQuestions[phraseMelangee.examId] = grouppedQuestions[phraseMelangee.examId]
                ? {
                      ...grouppedQuestions[phraseMelangee.examId],
                      phrasesMelangees: [
                          ...grouppedQuestions[phraseMelangee.examId].phrasesMelangees,
                          phraseMelangee,
                      ],
                  }
                : { phrasesMelangees: [phraseMelangee], qcms: [], questionsTrou: [] };
        });
        for (const { questionsTrou, phrasesMelangees, qcms } of Object.values(grouppedQuestions)) {
            let order = 0;
            for (const qcm of qcms) {
                questions.push([
                    "'qcm'",
                    `'${qcm.title.replace(/'/g, "''")}'`,
                    qcm.points,
                    "''",
                    `'${qcm.rightAnswerIndex}'`,
                    order,
                    `'${qcm.possibleAnswers.replace(/'/g, "''")}'`,
                    `'${qcm.examId}'`,
                ]);
                order++;
            }
            for (const questionTrou of questionsTrou) {
                questions.push([
                    "'questionTrou'",
                    `'${questionTrou.beforeText.replace(
                        /'/g,
                        "''",
                    )} .... ${questionTrou.afterText.replace(/'/g, "''")}'`,
                    questionTrou.points,
                    `'${questionTrou.acceptableAnswers.replace(/'/g, "''")}'`,
                    `'${questionTrou.rightAnswers.replace(/'/g, "''")}'`,
                    order,
                    `NULL`,
                    `'${questionTrou.examId}'`,
                ]);
                order++;
            }
            for (const phraseMelangee of phrasesMelangees) {
                questions.push([
                    "'phraseMelangee'",
                    `'${phraseMelangee.shuffledPhrase.replace(/'/g, "''")}'`,
                    phraseMelangee.points,
                    `''`,
                    `'${phraseMelangee.correctPhrases.replace(/'/g, "''")}'`,
                    order,
                    `NULL`,
                    `'${phraseMelangee.examId}'`,
                ]);
                order++;
            }
        }

        const query = `INSERT INTO question (${columns
            .map((column) => `"${column}"`)
            .join(', ')}) VALUES ${questions
            .map((question) => `(${question.join(', ')})`)
            .join(', ')}`;
        await queryRunner.query(query);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "question" DROP CONSTRAINT "FK_286bbf761d3af4e2fcac4a634d5"`,
        );
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TYPE "public"."question_kind_enum"`);
    }
}
