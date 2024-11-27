import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusAndPackageIdToCheckoutSession1732719281361 implements MigrationInterface {
    name = 'AddStatusAndPackageIdToCheckoutSession1732719281361';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`TRUNCATE TABLE "payment_session"`);
        await queryRunner.query(
            `CREATE TYPE "public"."payment_session_status_enum" AS ENUM('pending', 'completed')`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_session" ADD "status" "public"."payment_session_status_enum" NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE "payment_session" ADD "packageId" uuid NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "payment_session" ADD CONSTRAINT "FK_89b148dd07f31f5e20c1b3db23b" FOREIGN KEY ("packageId") REFERENCES "package"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "payment_session" DROP CONSTRAINT "FK_89b148dd07f31f5e20c1b3db23b"`,
        );
        await queryRunner.query(`ALTER TABLE "payment_session" DROP COLUMN "packageId"`);
        await queryRunner.query(`ALTER TABLE "payment_session" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."payment_session_status_enum"`);
    }
}
