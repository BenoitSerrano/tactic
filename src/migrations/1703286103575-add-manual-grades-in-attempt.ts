import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddManualGradesInAttempt1703286103575 implements MigrationInterface {
    name = 'AddManualGradesInAttempt1703286103575';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "attempt" ADD "manualGrades" text NOT NULL DEFAULT ''`,
        );

        const questions = await queryRunner.query(
            `SELECT id, kind, points FROM question WHERE kind='texteLibre'`,
        );
        const questionPointsMapping: Record<number, number> = {};
        for (const question of questions) {
            questionPointsMapping[question.id] = question.points;
        }

        const attempts = await queryRunner.query(`SELECT * FROM attempt`);
        for (const attempt of attempts) {
            const grades: Record<number, 'A' | 'B' | 'C' | 'D' | 'E'> = {};
            if (!attempt.marks) {
                continue;
            }
            for (const markEntry of attempt.marks.split(',')) {
                const splitMark = markEntry.split(':');
                if (splitMark.length !== 2) {
                    throw new Error(`marksArray '${attempts.marks}' is wrongly formatted`);
                }
                const [questionId, mark] = splitMark;
                const totalPoints = questionPointsMapping[Number(questionId)];
                if (totalPoints === undefined) {
                    throw new Error(`No points defined for questionId ${questionId}`);
                }
                const grade = convertMarkToGrade(Number(mark), totalPoints);
                grades[Number(questionId)] = grade;
            }
            const manualGrades = Object.entries(grades).map(([questionId, grade]) => {
                return `${questionId}:${grade}`;
            });
            await queryRunner.query(
                `UPDATE "attempt" SET "manualGrades"='${manualGrades.join(',')}' WHERE "id"='${
                    attempt.id
                }'`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "manualGrades"`);
    }
}

function convertMarkToGrade(mark: number, totalPoints: number) {
    switch (mark / totalPoints) {
        case 1:
            return 'A';
        case 0.75:
            return 'B';
        case 0.5:
            return 'C';
        case 0.25:
            return 'D';
        case 0:
            return 'E';
    }
    throw new Error(`Cannot compute grade for ${mark}/${totalPoints}`);
}
