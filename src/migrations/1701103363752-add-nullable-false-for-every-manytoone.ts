import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNullableFalseForEveryManytoone1701103363752 implements MigrationInterface {
    name = 'AddNullableFalseForEveryManytoone1701103363752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_06e63ae64f3874fe2645d11f9b6"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_65b233eb9155519df0f7255d20e"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "One student has one shot for an exam"`);
        await queryRunner.query(`ALTER TABLE "attempt" ALTER COLUMN "studentId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attempt" ALTER COLUMN "examId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam" DROP CONSTRAINT "FK_27622fbe99d85dc11b081f64a12"`);
        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reset_password_request" DROP CONSTRAINT "FK_f49e9196528497e5762e5fac23d"`);
        await queryRunner.query(`ALTER TABLE "reset_password_request" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "One student has one shot for an exam" UNIQUE ("studentId", "examId")`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "Students are unique by teacher" UNIQUE ("email", "groupId")`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "FK_06e63ae64f3874fe2645d11f9b6" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "FK_65b233eb9155519df0f7255d20e" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam" ADD CONSTRAINT "FK_27622fbe99d85dc11b081f64a12" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reset_password_request" ADD CONSTRAINT "FK_f49e9196528497e5762e5fac23d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reset_password_request" DROP CONSTRAINT "FK_f49e9196528497e5762e5fac23d"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP CONSTRAINT "FK_27622fbe99d85dc11b081f64a12"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_65b233eb9155519df0f7255d20e"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_06e63ae64f3874fe2645d11f9b6"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "Students are unique by teacher"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "One student has one shot for an exam"`);
        await queryRunner.query(`ALTER TABLE "reset_password_request" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reset_password_request" ADD CONSTRAINT "FK_f49e9196528497e5762e5fac23d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam" ADD CONSTRAINT "FK_27622fbe99d85dc11b081f64a12" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attempt" ALTER COLUMN "examId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attempt" ALTER COLUMN "studentId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "One student has one shot for an exam" UNIQUE ("studentId", "examId")`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "FK_65b233eb9155519df0f7255d20e" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "FK_06e63ae64f3874fe2645d11f9b6" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
