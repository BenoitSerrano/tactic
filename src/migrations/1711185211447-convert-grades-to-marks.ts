import { MigrationInterface, QueryRunner } from 'typeorm';
type gradeType = 'A' | 'B' | 'C' | 'D' | 'E';

export class ConvertGradesToMarks1711185211447 implements MigrationInterface {
    name = 'ConvertGradesToMarks1711185211447';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" ADD "manualMarks" text NOT NULL DEFAULT ''`);
        const questions = await queryRunner.query(
            `SELECT id, kind, points FROM question WHERE kind='texteLibre'`,
        );
        const questionPointsMapping: Record<number, number> = {};
        for (const question of questions) {
            questionPointsMapping[question.id] = question.points;
        }
        const attempts = await queryRunner.query(`SELECT * FROM attempt`);
        for (const attempt of attempts) {
            const manualMarks: Record<number, number> = {};
            if (!attempt.manualGrades) {
                continue;
            }
            for (const manualGradeEntry of attempt.manualGrades.split(',')) {
                const splitManualGrade = manualGradeEntry.split(':');
                if (splitManualGrade.length !== 2) {
                    throw new Error(
                        `attempt.manualGrades '${attempts.manualGrades}' is wrongly formatted`,
                    );
                }
                const [questionId, grade] = splitManualGrade as [number, gradeType];
                const totalPoints = questionPointsMapping[Number(questionId)];
                if (totalPoints === undefined) {
                    throw new Error(`No points defined for questionId ${questionId}`);
                }
                const manualMark = convertGradeToMark(grade, totalPoints);
                if (manualMark === undefined) {
                    throw new Error(`manualGrade ${grade} is not accepted`);
                }
                manualMarks[Number(questionId)] = manualMark;
            }
            const formattedManualMarks = Object.entries(manualMarks).map(
                ([questionId, manualMark]) => {
                    return `${questionId}:${manualMark}`;
                },
            );
            if (formattedManualMarks.length > 0) {
                await queryRunner.query(
                    `UPDATE "attempt" SET "manualMarks"='${formattedManualMarks.join(
                        ',',
                    )}' WHERE "id"='${attempt.id}'`,
                );
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "manualMarks"`);
    }
}

function convertGradeToMark(grade: gradeType | undefined, totalPoints: number) {
    switch (grade) {
        case 'A':
            return totalPoints;
        case 'B':
            return totalPoints * 0.75;
        case 'C':
            return totalPoints * 0.5;
        case 'D':
            return totalPoints * 0.25;
        case 'E':
            return 0;
    }
    return undefined;
}
