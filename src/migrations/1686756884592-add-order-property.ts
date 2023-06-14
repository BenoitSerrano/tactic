import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderProperty1686756884592 implements MigrationInterface {
    name = 'AddOrderProperty1686756884592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_choix_multiple" ADD "order" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_choix_multiple" DROP COLUMN "order"`);
    }

}
