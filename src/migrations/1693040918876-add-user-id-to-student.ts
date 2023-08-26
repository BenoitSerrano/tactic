import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdToStudent1693040918876 implements MigrationInterface {
    name = 'AddUserIdToStudent1693040918876';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ADD "userId" uuid`);
        await queryRunner.query(
            `ALTER TABLE "student" ADD CONSTRAINT "FK_b35463776b4a11a3df3c30d920a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "student" DROP CONSTRAINT "FK_b35463776b4a11a3df3c30d920a"`,
        );
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "userId"`);
    }
}
