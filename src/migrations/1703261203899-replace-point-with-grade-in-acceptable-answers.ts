import { MigrationInterface, QueryRunner } from 'typeorm';

type gradeType = 'A' | 'B' | 'C' | 'D';

type questionKindType = 'qcm' | 'questionReponse' | 'phraseMelangee' | 'texteATrous' | 'texteLibre';

export class ReplacePointWithGradeInAcceptableAnswers1703261203899 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const questions = await queryRunner.query(`SELECT * FROM question`);
        for (const question of questions) {
            const acceptableAnswers = question.acceptableAnswers;
            if (!acceptableAnswers) {
                continue;
            }
            const splitAcceptableAnswers = acceptableAnswers.split(',');
            assertAreAcceptableAnswersConsistent(
                question.kind,
                question.title,
                splitAcceptableAnswers,
            );

            const newAcceptableAnswers: string[] = [];
            for (const acceptableAnswer of splitAcceptableAnswers) {
                const parsedAcceptableAnswer = parsePoints(acceptableAnswer);
                const grade = convertPointsToGrade(
                    parsedAcceptableAnswer.points,
                    question.points,
                    question.kind,
                );
                const newAcceptableAnswer = stringifyGrade({
                    grade,
                    answer: parsedAcceptableAnswer.answer,
                });
                newAcceptableAnswers.push(newAcceptableAnswer);
            }

            await queryRunner.query(
                `UPDATE "question" SET "acceptableAnswers"='${newAcceptableAnswers.join(
                    ',',
                )}' WHERE "id"=${question.id}`,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const questions = await queryRunner.query(`SELECT * FROM question`);
        for (const question of questions) {
            const acceptableAnswers = question.acceptableAnswers;
            if (!acceptableAnswers) {
                continue;
            }
            const splitAcceptableAnswers = acceptableAnswers.split(',');
            const newAcceptableAnswers: string[] = [];
            for (const acceptableAnswer of splitAcceptableAnswers) {
                const parsedAcceptableAnswer = parseGrade(acceptableAnswer);
                const points = convertGradeToPoints(parsedAcceptableAnswer.grade, question);
                const newAcceptableAnswer = stringifyPoints({
                    points,
                    answer: parsedAcceptableAnswer.answer,
                });
                newAcceptableAnswers.push(newAcceptableAnswer);
            }
            await queryRunner.query(
                `UPDATE "question" SET "acceptableAnswers"='${newAcceptableAnswers.join(
                    ',',
                )}' WHERE "id"=${question.id}`,
            );
        }
    }
}

function assertAreAcceptableAnswersConsistent(
    questionKind: questionKindType,
    title: string,
    acceptableAnswers: string[],
) {
    const blankCount = computeBlankCount(title);
    if (questionKind === 'texteATrous' && blankCount !== acceptableAnswers.length) {
        throw new Error(
            `Inconsistent answers: Title: "${title}" and answers: [${acceptableAnswers
                .map((acceptableAnswer) => `"${acceptableAnswer}"`)
                .join(', ')}]`,
        );
    }
}

function convertPointsToGrade(
    points: number,
    totalPoints: number,
    questionKind: questionKindType,
): gradeType {
    if (questionKind === 'texteATrous' || questionKind === 'qcm') {
        return 'A';
    }
    if (points > totalPoints) {
        return 'A';
    }
    switch (points / totalPoints) {
        case 1:
            return 'A';
        case 0.75:
            return 'B';
        case 0.5:
            return 'C';
        case 0.25:
            return 'D';
        default:
            throw new Error(
                `"${questionKind}": error while trying to convert ${points}/${totalPoints} to a grade`,
            );
    }
}
function convertGradeToPoints(
    grade: gradeType,
    question: { points: number; kind: questionKindType; title: string },
): number {
    if (question.kind === 'texteATrous') {
        const blankCount = computeBlankCount(question.title);
        if (blankCount === 0) {
            throw new Error(`No blank for tàt in title ${question.title}`);
        }
        return question.points / blankCount;
    }
    switch (grade) {
        case 'A':
            return question.points;
        case 'B':
            return question.points * 0.75;
        case 'C':
            return question.points * 0.5;
        case 'D':
            return question.points * 0.25;
        default:
            throw new Error(`error while trying to convert ${grade} to points`);
    }
}

function computeBlankCount(title: string) {
    return title.split(' ').filter((chunk) => chunk === '....').length;
}

function stringifyPoints(acceptableAnswer: { points: number; answer: string }) {
    return `${acceptableAnswer.points}:${acceptableAnswer.answer}`;
}

function stringifyGrade(acceptableAnswer: { grade: gradeType; answer: string }) {
    return `${acceptableAnswer.grade}:${acceptableAnswer.answer}`;
}

function parsePoints(acceptableAnswer: string) {
    const ACCEPTABLE_ANSWER_REGEX = /^(\d+(?:.\d+)?):(.*)$/;
    const match = acceptableAnswer.match(ACCEPTABLE_ANSWER_REGEX);
    if (!match) {
        throw new Error(`Wrongly formatted acceptable Answer: ${acceptableAnswer}`);
    }
    const points = Number(match[1]);
    const answer = match[2];
    return { points, answer };
}

function parseGrade(acceptableAnswer: string) {
    const ACCEPTABLE_ANSWER_REGEX = /^([A-D]):(.*)$/;
    const match = acceptableAnswer.match(ACCEPTABLE_ANSWER_REGEX);
    if (!match) {
        throw new Error(`Wrongly formatted acceptable Answer: ${acceptableAnswer}`);
    }
    const grade = match[1] as gradeType;
    const answer = match[2];
    return { grade, answer };
}
