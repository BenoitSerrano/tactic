import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExpiredToSessionStatus1732890483492 implements MigrationInterface {
    name = 'AddExpiredToSessionStatus1732890483492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."payment_session_status_enum" RENAME TO "payment_session_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_session_status_enum" AS ENUM('pending', 'completed', 'expired')`);
        await queryRunner.query(`ALTER TABLE "payment_session" ALTER COLUMN "status" TYPE "public"."payment_session_status_enum" USING "status"::"text"::"public"."payment_session_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_session_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_session_status_enum_old" AS ENUM('pending', 'completed')`);
        await queryRunner.query(`ALTER TABLE "payment_session" ALTER COLUMN "status" TYPE "public"."payment_session_status_enum_old" USING "status"::"text"::"public"."payment_session_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."payment_session_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."payment_session_status_enum_old" RENAME TO "payment_session_status_enum"`);
    }

}
