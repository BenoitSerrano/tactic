import { MigrationInterface, QueryRunner } from 'typeorm';
import { Buffer } from 'node:buffer';

export class AddAnswersToAttempt1697043908355 implements MigrationInterface {
    name = 'AddAnswersToAttempt1697043908355';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" ADD "answers" text NOT NULL DEFAULT ''`);
        const attempts = await queryRunner.query(`SELECT * FROM attempt`);
        const qcmAnswers = await queryRunner.query(`SELECT * FROM qcm_answer`);
        const questionTrouAnswers = await queryRunner.query(`SELECT * FROM question_trou_answer`);
        const phraseMelangeeAnswers = await queryRunner.query(
            `SELECT * FROM phrase_melangee_answer`,
        );
        for (const attempt of attempts) {
            const specificQCMAnswers = qcmAnswers.filter(
                (qcmAnswer: any) => qcmAnswer['attemptId'] === attempt['id'],
            );
            const specificQTAnswers = questionTrouAnswers.filter(
                (questionTrouAnswer: any) => questionTrouAnswer['attemptId'] === attempt['id'],
            );
            const specificPMAnswers = phraseMelangeeAnswers.filter(
                (phraseMelangeeAnswer: any) => phraseMelangeeAnswer['attemptId'] === attempt['id'],
            );
            const answers = stringifyAnswers({
                qcmChoices: specificQCMAnswers.reduce((acc: any, qcmAnswer: any) => {
                    return {
                        ...acc,
                        [qcmAnswer['questionChoixMultipleId']]: `${qcmAnswer.choice}`,
                    };
                }, {}),
                questionTrouAnswers: specificQTAnswers.reduce((acc: any, qtAnswer: any) => {
                    return {
                        ...acc,
                        [qtAnswer['questionTrouId']]: `${qtAnswer.answer}`,
                    };
                }, {}),
                phraseMelangeeAnswers: specificPMAnswers.reduce((acc: any, pmAnswer: any) => {
                    return {
                        ...acc,
                        [pmAnswer['phraseMelangeeId']]: `${pmAnswer.answer}`,
                    };
                }, {}),
            });
            await queryRunner.query(
                `UPDATE attempt SET answers='${answers.join(',')}' WHERE id='${attempt.id}'`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "answers"`);
    }
}

function stringifyAnswers(attemptAnswers: any) {
    let answers: string[] = [];
    for (const [qcmId, qcmAnswer] of Object.entries(attemptAnswers.qcmChoices)) {
        const answer = `QCM:${qcmId}-${btoa(`${qcmAnswer}`)}`;
        answers.push(answer);
    }

    for (const [questionTrouId, questionTrouAnswer] of Object.entries(
        attemptAnswers.questionTrouAnswers,
    )) {
        const answer = `QT:${questionTrouId}-${btoa(questionTrouAnswer as string)}`;
        answers.push(answer);
    }

    for (const [phraseMelangeeId, phraseMelangeeAnswer] of Object.entries(
        attemptAnswers.phraseMelangeeAnswers,
    )) {
        const answer = `PM:${phraseMelangeeId}-${btoa(phraseMelangeeAnswer as string)}`;
        answers.push(answer);
    }

    return answers;
}

function btoa(str: string) {
    return Buffer.from(str).toString('base64');
}
