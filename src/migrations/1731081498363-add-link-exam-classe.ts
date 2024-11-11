import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLinkExamClasse1731081498363 implements MigrationInterface {
    name = 'AddLinkExamClasse1731081498363';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" ADD "classeId" uuid`);

        const users = await queryRunner.query(`SELECT * FROM "user"`);
        for (const user of users) {
            const classes = await queryRunner.query(
                `SELECT * FROM "classe" WHERE "userId"='${user.id}'`,
            );
            let classeId = '';
            if (classes.length === 0) {
                console.log(`NO CLASSE FOUND FOR USER ${user.email}`);
                const result: Array<{ id: string }> = await queryRunner.query(
                    `INSERT INTO "classe" ("name", "userId") VALUES ('Groupe par défaut', '${user.id}') RETURNING id`,
                );
                classeId = result[0].id;
            } else {
                classeId = classes[0].id;
            }
            await queryRunner.query(
                `UPDATE "exam" SET "classeId"='${classeId}' WHERE "userId"='${user.id}' `,
            );
        }

        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "classeId" SET NOT NULL`);

        await queryRunner.query(
            `ALTER TABLE "exam" ADD CONSTRAINT "FK_bfc0e405a355aaa734fe739b5c6" FOREIGN KEY ("classeId") REFERENCES "classe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "exam" DROP CONSTRAINT "FK_bfc0e405a355aaa734fe739b5c6"`,
        );
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "classeId"`);
    }
}
