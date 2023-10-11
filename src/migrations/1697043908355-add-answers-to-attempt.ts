import { MigrationInterface, QueryRunner } from 'typeorm';

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

    Object.entries(attemptAnswers.qcmChoices).forEach(([qcmId, qcmAnswer]) => {
        answers.push(`QCM:${qcmId}-${qcmAnswer}`);
    });

    Object.entries(attemptAnswers.questionTrouAnswers).forEach(
        ([questionTrouId, questionTrouAnswer]) => {
            answers.push(`QT:${questionTrouId}-${questionTrouAnswer}`);
        },
    );

    Object.entries(attemptAnswers.phraseMelangeeAnswers).forEach(
        ([phraseMelangeeId, phraseMelangeeAnswer]) => {
            answers.push(`PM:${phraseMelangeeId}-${phraseMelangeeAnswer}`);
        },
    );
    return answers.map((answer) => btoa(answer));
}

function parseAnswers(answers: string[]) {
    const ANSWER_REGEX = /([A-Z]+):(\d+)-(.*)/;
    let attemptAnswers = answers.reduce(
        (acc, answer) => {
            let regexMatch = answer.match(ANSWER_REGEX);
            if (!regexMatch) {
                throw new Error(`answer ${answer} is wrongly formatted.`);
            }
            const [_, questionType, questionId, questionAnswer] = regexMatch;
            let key: 'qcmChoices' | 'questionTrouAnswers' | 'phraseMelangeeAnswers' = 'qcmChoices';
            switch (questionType) {
                case 'QCM':
                    key = 'qcmChoices';
                    break;
                case 'QT':
                    key = 'questionTrouAnswers';
                    break;
                case 'PM':
                    key = 'phraseMelangeeAnswers';
                    break;
            }

            return { ...acc, [key]: { ...acc[key], [questionId]: questionAnswer } };
        },
        {
            qcmChoices: {},
            questionTrouAnswers: {},
            phraseMelangeeAnswers: {},
        } as any,
    );
    return attemptAnswers;
}
