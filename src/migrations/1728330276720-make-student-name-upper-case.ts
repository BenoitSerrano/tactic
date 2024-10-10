import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeStudentNameUpperCase1728330276720 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const students = await queryRunner.query(`SELECT * FROM "student";`);
        await Promise.all(
            students.map((student: { id: string; lastName: string }) => {
                return queryRunner.query(
                    `UPDATE "student" SET "lastName"='${student.lastName.toUpperCase()}' WHERE "id"='${
                        student.id
                    }'`,
                );
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
