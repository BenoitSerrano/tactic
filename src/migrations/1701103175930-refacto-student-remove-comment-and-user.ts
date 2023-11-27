import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactoStudentRemoveCommentAndUser1701103175930 implements MigrationInterface {
    name = 'RefactoStudentRemoveCommentAndUser1701103175930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_b35463776b4a11a3df3c30d920a"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "userId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "student" ADD "comment" character varying`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_b35463776b4a11a3df3c30d920a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
