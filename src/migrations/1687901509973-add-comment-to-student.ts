import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentToStudent1687901509973 implements MigrationInterface {
    name = 'AddCommentToStudent1687901509973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ADD "comment" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "comment"`);
    }

}
