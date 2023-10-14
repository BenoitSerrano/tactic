import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestionEntity1697208383373 implements MigrationInterface {
    name = 'AddQuestionEntity1697208383373';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."question_kind_enum" AS ENUM('qcm', 'questionTrou', 'phraseMelangee')`,
        );
        await queryRunner.query(
            `CREATE TABLE "question" ("id" SERIAL NOT NULL, "kind" "public"."question_kind_enum" NOT NULL, "title" character varying NOT NULL, "points" double precision NOT NULL, "acceptableAnswers" text NOT NULL DEFAULT '', "rightAnswers" text NOT NULL DEFAULT '', "order" integer NOT NULL, "possibleAnswers" text, "examId" uuid, CONSTRAINT "The order for a question is unique inside an exam" UNIQUE ("order", "examId"), CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
        );

        await queryRunner.query(
            `ALTER TABLE "question" ADD CONSTRAINT "FK_286bbf761d3af4e2fcac4a634d5" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "attempt" ADD "answerss" text NOT NULL DEFAULT ''`);

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
        const organizedQuestions: any = [];
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
                const organizedQuestion: any = {};
                organizedQuestion['id'] = qcm.id;
                organizedQuestion['kind'] = "'qcm'";
                organizedQuestion['title'] = `'${qcm.title.replace(/'/g, "''")}'`;
                organizedQuestion['points'] = qcm.points;
                organizedQuestion['acceptableAnswers'] = "''";
                organizedQuestion['rightAnswers'] = `'${qcm.rightAnswerIndex}'`;
                organizedQuestion['order'] = order;
                organizedQuestion['possibleAnswers'] = `'${qcm.possibleAnswers.replace(
                    /'/g,
                    "''",
                )}'`;
                organizedQuestion['examId'] = `'${qcm.examId}'`;
                organizedQuestions.push(organizedQuestion);

                order++;
            }
            for (const questionTrou of questionsTrou) {
                const organizedQuestion: any = {};
                organizedQuestion['id'] = questionTrou.id;

                organizedQuestion['kind'] = "'questionTrou'";
                organizedQuestion['title'] = `'${questionTrou.beforeText.replace(
                    /'/g,
                    "''",
                )} .... ${questionTrou.afterText.replace(/'/g, "''")}'`.trim();
                organizedQuestion['points'] = questionTrou.points;
                organizedQuestion['acceptableAnswers'] = `'${questionTrou.acceptableAnswers.replace(
                    /'/g,
                    "''",
                )}'`;
                organizedQuestion['rightAnswers'] = `'${questionTrou.rightAnswers.replace(
                    /'/g,
                    "''",
                )}'`;
                organizedQuestion['order'] = order;
                organizedQuestion['possibleAnswers'] = `NULL`;
                organizedQuestion['examId'] = `'${questionTrou.examId}'`;
                organizedQuestions.push(organizedQuestion);
                order++;
            }
            for (const phraseMelangee of phrasesMelangees) {
                const organizedQuestion: any = {};
                organizedQuestion['id'] = phraseMelangee.id;
                organizedQuestion['kind'] = "'phraseMelangee'";
                organizedQuestion['title'] = `'${phraseMelangee.shuffledPhrase.replace(
                    /'/g,
                    "''",
                )}'`;
                organizedQuestion['points'] = phraseMelangee.points;
                organizedQuestion['acceptableAnswers'] = `''`;
                organizedQuestion['rightAnswers'] = `'${phraseMelangee.correctPhrases.replace(
                    /'/g,
                    "''",
                )}'`;
                organizedQuestion['order'] = order;
                organizedQuestion['possibleAnswers'] = `NULL`;
                organizedQuestion['examId'] = `'${phraseMelangee.examId}'`;
                organizedQuestions.push(organizedQuestion);
                order++;
            }
        }

        const mappedIds: Record<string, number> = {};

        for (const organizedQuestion of organizedQuestions) {
            const query = `INSERT INTO question (${columns
                .map((column) => `"${column}"`)
                .join(', ')}) VALUES (${columns
                .map((column) => organizedQuestion[column])
                .join(', ')}) RETURNING id`;
            const result: Array<{ id: number }> = await queryRunner.query(query);
            let answerPrefix = '';
            switch (organizedQuestion['kind']) {
                case "'qcm'":
                    answerPrefix = 'QCM-' + organizedQuestion['id'];
                    break;
                case "'questionTrou'":
                    answerPrefix = 'QT-' + organizedQuestion['id'];
                    break;
                case "'phraseMelangee'":
                    answerPrefix = 'PM-' + organizedQuestion['id'];
                    break;
                default:
                    throw new Error("Can't handle type " + organizedQuestion['kind']);
            }
            mappedIds[answerPrefix] = result[0].id;
        }
        const attempts = await queryRunner.query(`SELECT * FROM attempt;`);
        for (const attempt of attempts) {
            const answers: string[] = attempt.answers.split(',');
            const ANSWER_REGEX = /([A-Z]+):(\d+)-(.*)/;
            const newAnswers: string[] = [];
            for (const answer of answers) {
                if (!answer) {
                    continue;
                }
                const regexMatch = answer.match(ANSWER_REGEX);
                if (!regexMatch) {
                    throw new Error(
                        `Wrongly formatted answer: ${answer} for attempt ${attempt.id}`,
                    );
                }
                const [_, questionType, oldQuestionId, encodedQuestionAnswer] = regexMatch;
                if (!encodedQuestionAnswer) {
                    continue;
                }
                const answerPrefix = questionType + '-' + oldQuestionId;
                const newQuestionId = mappedIds[answerPrefix];
                if (!newQuestionId) {
                    throw new Error(`answerPrefix ${answerPrefix} does not exist`);
                }
                const newAnswer = newQuestionId + ':' + encodedQuestionAnswer;
                newAnswers.push(newAnswer);
            }
            await queryRunner.query(
                `UPDATE attempt SET answerss='${newAnswers.join(',')}' WHERE id='${attempt.id}'`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "question" DROP CONSTRAINT "FK_286bbf761d3af4e2fcac4a634d5"`,
        );
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TYPE "public"."question_kind_enum"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "answerss"`);
    }
}
