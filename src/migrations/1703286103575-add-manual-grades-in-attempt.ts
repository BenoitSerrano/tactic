import { MigrationInterface, QueryRunner } from 'typeorm';
type gradeType = 'A' | 'B' | 'C' | 'D' | 'E';

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
                const grade = roundToClosestGrade(Number(mark) / totalPoints);
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

function roundToClosestGrade(ratio: number): gradeType {
    const gradeMappings: Array<{ grade: gradeType; ratio: number }> = [
        { grade: 'A', ratio: 1 },
        { grade: 'B', ratio: 0.75 },
        { grade: 'C', ratio: 0.5 },
        { grade: 'D', ratio: 0.25 },
        { grade: 'E', ratio: 0 },
    ];
    for (let i = 0; i < gradeMappings.length - 1; i++) {
        const medianRatio = (gradeMappings[i].ratio + gradeMappings[i + 1].ratio) / 2;
        if (ratio >= medianRatio) {
            return gradeMappings[i].grade;
        }
    }
    return 'E';
}
