import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserToAttempt1732811316868 implements MigrationInterface {
    name = 'AddUserToAttempt1732811316868';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" ADD "userId" uuid`);
        await queryRunner.query(
            `ALTER TABLE "attempt" ADD CONSTRAINT "FK_dd8844876037b478f5bb859512e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        const exams = await queryRunner.query(`SELECT "id", "userId" FROM "exam"`);
        for (const exam of exams) {
            await queryRunner.query(
                `UPDATE "attempt" SET "userId"='${exam.userId}' WHERE "examId"='${exam.id}'`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "attempt" DROP CONSTRAINT "FK_dd8844876037b478f5bb859512e"`,
        );
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "userId"`);
    }
}
