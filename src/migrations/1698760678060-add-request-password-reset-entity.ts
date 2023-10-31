import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRequestPasswordResetEntity1698760678060 implements MigrationInterface {
    name = 'AddRequestPasswordResetEntity1698760678060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reset_password_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_74675f940551b34f6e321247b81" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reset_password_request" ADD CONSTRAINT "FK_f49e9196528497e5762e5fac23d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reset_password_request" DROP CONSTRAINT "FK_f49e9196528497e5762e5fac23d"`);
        await queryRunner.query(`DROP TABLE "reset_password_request"`);
    }

}
