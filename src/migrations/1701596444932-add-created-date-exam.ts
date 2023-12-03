import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedDateExam1701596444932 implements MigrationInterface {
    name = 'AddCreatedDateExam1701596444932';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "exam" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "createdAt"`);
    }
}
