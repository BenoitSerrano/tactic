import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeEstablishmentMandatoryForClasse1731632224140 implements MigrationInterface {
    name = 'MakeEstablishmentMandatoryForClasse1731632224140';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const classes = await queryRunner.query(`SELECT * FROM "classe"`);

        for (const classe of classes) {
            if (!classe.establishmentId) {
                const establishmentsForUser = await queryRunner.query(
                    `SELECT * FROM "establishment" WHERE "userId"='${classe.userId}'`,
                );
                if (establishmentsForUser.length === 0) {
                    throw new Error(`No establishment for user ${classe.userId}`);
                }
                await queryRunner.query(
                    `UPDATE "classe" SET "establishmentId"='${establishmentsForUser[0].id}' WHERE "id"='${classe.id}'`,
                );
            }
        }
        await queryRunner.query(
            `ALTER TABLE "classe" DROP CONSTRAINT "FK_e5836cbce66d2c3ea9c75fc8bbf"`,
        );
        await queryRunner.query(`ALTER TABLE "classe" ALTER COLUMN "establishmentId" SET NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "classe" ADD CONSTRAINT "FK_e5836cbce66d2c3ea9c75fc8bbf" FOREIGN KEY ("establishmentId") REFERENCES "establishment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "classe" DROP CONSTRAINT "FK_e5836cbce66d2c3ea9c75fc8bbf"`,
        );
        await queryRunner.query(
            `ALTER TABLE "classe" ALTER COLUMN "establishmentId" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "classe" ADD CONSTRAINT "FK_e5836cbce66d2c3ea9c75fc8bbf" FOREIGN KEY ("establishmentId") REFERENCES "establishment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }
}
