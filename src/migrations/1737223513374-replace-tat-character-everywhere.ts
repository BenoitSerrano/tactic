import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceTatCharacterEverywhere1737223513374 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const questions = await queryRunner.query(
            `SELECT * FROM question WHERE kind='texteATrous'`,
        );
        for (const question of questions) {
            const newTitle = question.title.replace(/\.\.\.\./g, 'Ø');
            await queryRunner.query(`UPDATE question SET title = $1 WHERE id = $2`, [
                newTitle,
                question.id,
            ]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const questions = await queryRunner.query(
            `SELECT * FROM question WHERE kind='texteATrous'`,
        );
        for (const question of questions) {
            const newTitle = question.title.replace(/Ø/g, '....');
            await queryRunner.query(`UPDATE question SET title = $1 WHERE id = ${question.id}`, [
                newTitle,
            ]);
        }
    }
}
