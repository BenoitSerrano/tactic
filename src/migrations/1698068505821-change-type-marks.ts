import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTypeMarks1698068505821 implements MigrationInterface {
    name = 'ChangeTypeMarks1698068505821';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const attempts = await queryRunner.query(`SELECT id, marks FROM "attempt";`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "marks"`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD "marks" text NOT NULL DEFAULT ''`);
        for (const attempt of attempts) {
            await queryRunner.query(
                `UPDATE "attempt" SET "marks"='${attempt.marks}' WHERE "id"='${attempt.id}'`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const attempts = await queryRunner.query(`SELECT id, marks FROM "attempt";`);

        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "marks"`);
        await queryRunner.query(
            `ALTER TABLE "attempt" ADD "marks" character varying NOT NULL DEFAULT ''`,
        );
        for (const attempt of attempts) {
            await queryRunner.query(
                `UPDATE "attempt" SET "marks"='${attempt.marks}' WHERE "id"='${attempt.id}'`,
            );
        }
    }
}
