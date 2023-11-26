import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGroup1701025248030 implements MigrationInterface {
    name = 'AddGroup1701025248030';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`ALTER TABLE "student" ADD "groupId" uuid`);
        await queryRunner.query(
            `ALTER TABLE "group" ADD CONSTRAINT "FK_7bec24423f57c3786409cc3cc8d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "student" ADD CONSTRAINT "FK_ce9660fc114efef4062bba4c119" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        const users = await queryRunner.query(`SELECT id FROM "user"`);
        for (const user of users) {
            const result: Array<{ id: string }> = await queryRunner.query(
                `INSERT INTO "group" ("name", "userId") VALUES ('Groupe par défaut', '${user.id}') RETURNING id`,
            );
            const groupId = result[0].id;
            await queryRunner.query(
                `UPDATE "student" SET "groupId"='${groupId}' WHERE "userId"='${user.id}'`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "student" DROP CONSTRAINT "FK_ce9660fc114efef4062bba4c119"`,
        );
        await queryRunner.query(
            `ALTER TABLE "group" DROP CONSTRAINT "FK_7bec24423f57c3786409cc3cc8d"`,
        );
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "groupId"`);
        await queryRunner.query(`DROP TABLE "group"`);
    }
}
