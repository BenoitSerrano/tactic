import { MigrationInterface, QueryRunner } from 'typeorm';
const defaultStartText = `L''objectif de ce test est de trouver le cours le plus adapté à votre niveau. Chaque étudiant.e s''engage sur l''honneur à le passer sans utiliser de document et sans faire de recherche en ligne. Le test dure {{duration}} minutes. Faites attention : au-delà des {{duration}} minutes, vos réponses ne sont plus enregistrées. Quand vous avez fini le test, vous pouvez cliquer sur "Terminer l''examen". Si vous ne connaissez pas la réponse à une question, pas de stress : laissez juste la question en blanc.`;

const defaultEndText = `Merci d''avoir répondu au test, vos réponses ont été enregistrées.`;

export class AddUserConfiguration1724848823955 implements MigrationInterface {
    name = 'AddUserConfiguration1724848823955';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user_configuration" ("id" SERIAL NOT NULL, "defaultStartText" text NOT NULL DEFAULT 'L''objectif de ce test est de trouver le cours le plus adapté à votre niveau. Chaque étudiant.e s''engage sur l''honneur à le passer sans utiliser de document et sans faire de recherche en ligne. Le test dure {{duration}} minutes. Faites attention : au-delà des {{duration}} minutes, vos réponses ne sont plus enregistrées. Quand vous avez fini le test, vous pouvez cliquer sur "Terminer l''examen". Si vous ne connaissez pas la réponse à une question, pas de stress : laissez juste la question en blanc.', "defaultEndText" text NOT NULL DEFAULT 'Merci d''avoir répondu au test, vos réponses ont été enregistrées.', CONSTRAINT "PK_7de5e10e6970063ed2c7e3b9555" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`ALTER TABLE "user" ADD "userConfigurationId" integer`);

        const users = await queryRunner.query(`SELECT id FROM "user";`);
        for (const user of users) {
            await queryRunner.query(
                `UPDATE "exam" SET "startText"='${defaultStartText}' WHERE "userId"='${user.id}'`,
            );
            await queryRunner.query(
                `UPDATE "exam" SET "endText"='${defaultEndText}' WHERE "userId"='${user.id}'`,
            );

            const [insertedUserConfiguration] = await queryRunner.query(
                `INSERT INTO "user_configuration" ("defaultStartText", "defaultEndText") VALUES ('${defaultStartText}','${defaultEndText}') RETURNING id`,
            );
            await queryRunner.query(
                `UPDATE "user" SET "userConfigurationId"=${insertedUserConfiguration.id} WHERE "id"='${user.id}'`,
            );
        }
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "UQ_be01152e0c41ec4105e8bbc387b" UNIQUE ("userConfigurationId")`,
        );
        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "startText" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "endText" SET NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_be01152e0c41ec4105e8bbc387b" FOREIGN KEY ("userConfigurationId") REFERENCES "user_configuration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "FK_be01152e0c41ec4105e8bbc387b"`,
        );
        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "endText" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "startText" DROP NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "UQ_be01152e0c41ec4105e8bbc387b"`,
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userConfigurationId"`);
        await queryRunner.query(`DROP TABLE "user_configuration"`);
    }
}
