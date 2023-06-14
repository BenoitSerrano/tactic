import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteOrderProperty1686750641853 implements MigrationInterface {
    name = 'DeleteOrderProperty1686750641853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_choix_multiple" DROP COLUMN "order"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_choix_multiple" ADD "order" integer NOT NULL`);
    }

}
