import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomerIdToUser1732891340400 implements MigrationInterface {
    name = 'AddCustomerIdToUser1732891340400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "stripeCustomerId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "stripeCustomerId"`);
    }

}
