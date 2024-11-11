import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEstablishment1730819339029 implements MigrationInterface {
    name = 'AddEstablishment1730819339029';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "establishment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_149bd9dc1f2bd4e825a0c474932" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "establishment" ADD CONSTRAINT "FK_61e853387dd62d598d0adcc71c4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "classe" ADD "establishmentId" uuid`);
        await queryRunner.query(
            `ALTER TABLE "classe" ADD CONSTRAINT "FK_e5836cbce66d2c3ea9c75fc8bbf" FOREIGN KEY ("establishmentId") REFERENCES "establishment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        const users = await queryRunner.query(`SELECT * FROM "user"`);
        for (const user of users) {
            const userId = user.id;
            const result: Array<{ id: string }> = await queryRunner.query(
                `INSERT INTO "establishment" ("name", "userId") VALUES ('Établissement par défaut', '${userId}') RETURNING id`,
            );
            const establishmentId = result[0].id;
            await queryRunner.query(
                `UPDATE "classe" SET "establishmentId"='${establishmentId}' WHERE "userId"='${userId}'`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "classe" DROP CONSTRAINT "FK_e5836cbce66d2c3ea9c75fc8bbf"`,
        );
        await queryRunner.query(
            `ALTER TABLE "establishment" DROP CONSTRAINT "FK_61e853387dd62d598d0adcc71c4"`,
        );
        await queryRunner.query(`ALTER TABLE "classe" DROP COLUMN "establishmentId"`);
        await queryRunner.query(`DROP TABLE "establishment"`);
    }
}
