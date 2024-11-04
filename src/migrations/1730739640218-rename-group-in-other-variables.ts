import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameGroupInOtherVariables1730739640218 implements MigrationInterface {
    name = 'RenameGroupInOtherVariables1730739640218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classe" DROP CONSTRAINT "FK_7bec24423f57c3786409cc3cc8d"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_ce9660fc114efef4062bba4c119"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "Students are unique by group"`);
        await queryRunner.query(`ALTER TABLE "student" RENAME COLUMN "groupId" TO "classeId"`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "Students are unique by classe" UNIQUE ("email", "classeId")`);
        await queryRunner.query(`ALTER TABLE "classe" ADD CONSTRAINT "FK_17cbba9c6dec64190c728841bd1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_2f84203cfa347d2bba3c8501159" FOREIGN KEY ("classeId") REFERENCES "classe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_2f84203cfa347d2bba3c8501159"`);
        await queryRunner.query(`ALTER TABLE "classe" DROP CONSTRAINT "FK_17cbba9c6dec64190c728841bd1"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "Students are unique by classe"`);
        await queryRunner.query(`ALTER TABLE "student" RENAME COLUMN "classeId" TO "groupId"`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "Students are unique by group" UNIQUE ("email", "groupId")`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_ce9660fc114efef4062bba4c119" FOREIGN KEY ("groupId") REFERENCES "classe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classe" ADD CONSTRAINT "FK_7bec24423f57c3786409cc3cc8d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
