import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeUserConfigCompulsory1724849672351 implements MigrationInterface {
    name = 'MakeUserConfigCompulsory1724849672351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_be01152e0c41ec4105e8bbc387b"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userConfigurationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_be01152e0c41ec4105e8bbc387b" FOREIGN KEY ("userConfigurationId") REFERENCES "user_configuration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_be01152e0c41ec4105e8bbc387b"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userConfigurationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_be01152e0c41ec4105e8bbc387b" FOREIGN KEY ("userConfigurationId") REFERENCES "user_configuration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
