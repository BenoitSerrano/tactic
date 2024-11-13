import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimeRangeForExam1731170855812 implements MigrationInterface {
    name = 'AddTimeRangeForExam1731170855812';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" ADD "startTime" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "endTime" TIMESTAMP WITH TIME ZONE`);

        const exams: Array<{ id: string; duration: number | undefined }> = await queryRunner.query(
            `SELECT * FROM "exam"`,
        );
        const mappedExams = mapEntities(exams);
        const attempts: Array<{ id: string; examId: string; startedAt: string }> =
            await queryRunner.query(`SELECT * FROM "attempt"`);
        const extremums = attempts.reduce((acc, attempt) => {
            const previousValue = acc[attempt.examId];
            const startedAt = new Date(attempt.startedAt);
            const examDuration = mappedExams[attempt.examId].duration;

            if (!!previousValue) {
                const { min, max } = previousValue;
                let newMin = min,
                    newMax = max;
                if (min > startedAt.getTime()) {
                    newMin = startedAt.getTime();
                }
                if (examDuration === undefined) {
                    newMax = Infinity;
                } else if (max < startedAt.getTime() + examDuration * 60 * 1000) {
                    newMax = startedAt.getTime() + examDuration * 60 * 1000;
                }
                return { ...acc, [attempt.examId]: { min: newMin, max: newMax } };
            } else {
                const min = startedAt.getTime();
                const max =
                    examDuration === undefined
                        ? Infinity
                        : startedAt.getTime() + examDuration * 60 * 1000;
                return {
                    ...acc,
                    [attempt.examId]: {
                        min,
                        max,
                    },
                };
            }
        }, {} as Record<string, { min: number; max: number } | undefined>);

        for (const exam of exams) {
            const extremum = extremums[exam.id];
            if (extremum) {
                let startDate = new Date(extremum.min);
                await queryRunner.query(
                    `UPDATE "exam" SET "startTime"='${startDate.toISOString()}' WHERE "id"='${
                        exam.id
                    }'`,
                );
                if (extremum.max !== Infinity) {
                    const endDate = new Date();
                    endDate.setTime(extremum.max);

                    await queryRunner.query(
                        `UPDATE "exam" SET "endTime"='${endDate.toISOString()}' WHERE "id"='${
                            exam.id
                        }'`,
                    );
                }
            } else {
                const startDate = new Date();
                const endDate = new Date();
                await queryRunner.query(
                    `UPDATE "exam" SET "startTime"='${startDate.toISOString()}' WHERE "id"='${
                        exam.id
                    }'`,
                );
                await queryRunner.query(
                    `UPDATE "exam" SET "endTime"='${endDate.toISOString()}' WHERE "id"='${
                        exam.id
                    }'`,
                );
            }
        }

        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "startTime" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "startTime"`);
    }
}

function mapEntities<idT extends string | number, entityT extends { id: idT }>(
    entities: Array<entityT>,
) {
    return entities.reduce((acc, entity) => {
        return { ...acc, [entity.id]: entity };
    }, {} as Record<string, entityT>);
}
