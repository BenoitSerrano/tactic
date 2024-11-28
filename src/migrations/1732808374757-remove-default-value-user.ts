import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDefaultValueUser1732808374757 implements MigrationInterface {
    name = 'RemoveDefaultValueUser1732808374757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "remainingPapers" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "remainingPapers" SET DEFAULT '20'`);
    }

}
