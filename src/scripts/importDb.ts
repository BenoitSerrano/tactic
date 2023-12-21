import { dataSource } from '../dataSource';
import { api } from '../lib/api';
import { Attempt } from '../modules/attempt';
import { Exam } from '../modules/exam';
import { Exercise } from '../modules/exercise';
import { Group } from '../modules/group';
import { Question } from '../modules/question';
import { Student } from '../modules/student';
import { User } from '../modules/user';

type questionIdMappingType = Record<number, number>;

async function importDb() {
    console.log('Initializing database...');
    await dataSource.initialize();
    console.log('Database initialized!');
    const userRepository = dataSource.getRepository(User);
    const examRepository = dataSource.getRepository(Exam);
    const exerciseRepository = dataSource.getRepository(Exercise);
    const studentRepository = dataSource.getRepository(Student);
    const attemptRepository = dataSource.getRepository(Attempt);
    const groupRepository = dataSource.getRepository(Group);
    const questionRepository = dataSource.getRepository(Question);
    const user = await userRepository.findOneOrFail({ where: {} });

    console.log('Fetching exams...');
    const allExams = await api.fetchAllExams();
    console.log(`${allExams.length} exams fetched! Inserting them in database...`);

    const questionIdMapping: questionIdMappingType = {};
    for (const exam of allExams) {
        await examRepository.insert({ ...exam, user });
        for (const exercise of exam.exercises) {
            const result = await exerciseRepository.insert({ ...exercise, exam: { id: exam.id } });
            const exerciseId = result.identifiers[0].id;
            for (const question of exercise.questions) {
                const result = await questionRepository.insert({
                    ...question,
                    exercise: { id: exerciseId },
                });
                const distantQuestionId = question.id;
                const localQuestionId = result.identifiers[0].id as number;
                questionIdMapping[distantQuestionId] = localQuestionId;
            }
        }
    }
    console.log('Exams inserted! Now fetching groups...');

    const allGroups = await api.fetchAllGroups();

    console.log(`${allGroups.length} groups fetched! Inserting them in database...`);

    for (const group of allGroups) {
        await groupRepository.insert({ ...group, user });
    }

    console.log('Groups inserted! Now fetching students...');

    const allStudents = await api.fetchAllStudents();

    console.log(`${allStudents.length} students fetched! Inserting them in database...`);

    for (const student of allStudents) {
        await studentRepository.insert({ ...student });
    }

    console.log('Students inserted! Now fetching attempts...');

    const allAttempts = await api.fetchAllAttempts();

    console.log(`${allAttempts.length} attempts fetched! Inserting them in database...`);

    for (const attempt of allAttempts) {
        const translatedAnswers = replaceQuestionIdInAnswers(attempt.answers, questionIdMapping);
        await attemptRepository.insert({ ...attempt, answers: translatedAnswers });
    }
    console.log('Done!');
}

function replaceQuestionIdInAnswers(
    answers: Attempt['answers'],
    questionIdMapping: questionIdMappingType,
): Attempt['answers'] {
    const ANSWER_REGEX = /(\d+):(.*)/;
    let attemptAnswers = answers.map((answer) => {
        let regexMatch = answer.match(ANSWER_REGEX);
        if (!regexMatch) {
            throw new Error(`answer "${answer}" is wrongly formatted.`);
        }
        const [_, distantQuestionId, encodedQuestionAnswer] = regexMatch;
        const localQuestionId = questionIdMapping[Number(distantQuestionId)];
        return `${localQuestionId}:${encodedQuestionAnswer}`;
    });
    return attemptAnswers;
}

importDb();
