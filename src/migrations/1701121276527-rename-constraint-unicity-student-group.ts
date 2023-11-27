import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameConstraintUnicityStudentGroup1701121276527 implements MigrationInterface {
    name = 'RenameConstraintUnicityStudentGroup1701121276527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "Students are unique by teacher"`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "Students are unique by group" UNIQUE ("email", "groupId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "Students are unique by group"`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "Students are unique by teacher" UNIQUE ("email", "groupId")`);
    }

}
