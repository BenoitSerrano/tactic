import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentSession1732710494814 implements MigrationInterface {
    name = 'AddPaymentSession1732710494814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stripeCheckoutSessionId" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "UQ_e657cfa478bdc276f170dfeabf1" UNIQUE ("stripeCheckoutSessionId"), CONSTRAINT "PK_a1a91b20f7f3b1e5afb5485cbcd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment_session" ADD CONSTRAINT "FK_9adc3269ba91f9145ff876fdc78" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_session" DROP CONSTRAINT "FK_9adc3269ba91f9145ff876fdc78"`);
        await queryRunner.query(`DROP TABLE "payment_session"`);
    }

}
