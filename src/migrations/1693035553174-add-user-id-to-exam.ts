import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdToExam1693035553174 implements MigrationInterface {
    name = 'AddUserIdToExam1693035553174';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" ADD "userId" uuid`);
        await queryRunner.query(
            `ALTER TABLE "exam" ADD CONSTRAINT "FK_27622fbe99d85dc11b081f64a12" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "exam" DROP CONSTRAINT "FK_27622fbe99d85dc11b081f64a12"`,
        );
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "userId"`);
    }
}
