import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeDurationNullable1703785003060 implements MigrationInterface {
    name = 'MakeDurationNullable1703785003060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "duration" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "duration" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "duration" SET DEFAULT '15'`);
        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "duration" SET NOT NULL`);
    }

}
