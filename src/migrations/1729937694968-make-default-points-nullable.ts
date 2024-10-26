import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeDefaultPointsNullable1729937694968 implements MigrationInterface {
    name = 'MakeDefaultPointsNullable1729937694968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "defaultPoints" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "defaultPoints" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "defaultPoints" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "defaultPoints" SET NOT NULL`);
    }

}
