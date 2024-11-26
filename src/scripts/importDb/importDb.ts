import { dataSource } from '../../dataSource';
import { api } from '../../lib/api';
import { Attempt } from '../../modules/attempt';
import { Exam } from '../../modules/exam';
import { Exercise } from '../../modules/exercise';
import { Classe } from '../../modules/classe';
import { Question } from '../../modules/question';
import { Student } from '../../modules/student';
import { User } from '../../modules/user';
import { UserConfiguration } from '../../modules/userConfiguration';
import { Establishment } from '../../modules/establishment';

type questionIdMappingType = Record<number, number>;
type userConfigurationIdMappingType = Record<number, number>;

async function importDb() {
    console.log('=== importDb ===');

    if (process.env['NODE_ENV'] !== 'development') {
        throw new Error(`Cannot run importDb in non-local mode`);
    }
    console.log('Initializing database...');
    await dataSource.initialize();
    console.log('Database initialized!');
    const userRepository = dataSource.getRepository(User);
    const examRepository = dataSource.getRepository(Exam);
    const exerciseRepository = dataSource.getRepository(Exercise);
    const studentRepository = dataSource.getRepository(Student);
    const attemptRepository = dataSource.getRepository(Attempt);
    const classeRepository = dataSource.getRepository(Classe);
    const questionRepository = dataSource.getRepository(Question);
    const userConfigurationRepository = dataSource.getRepository(UserConfiguration);
    const establishmentRepository = dataSource.getRepository(Establishment);

    console.log('Erasing local database...');

    await examRepository.delete({});
    await establishmentRepository.delete({});
    await classeRepository.delete({});
    await userRepository.delete({});
    await userConfigurationRepository.delete({});

    console.log('Fetching user configurations...');

    const allUserConfigurations = await api.fetchAllUserConfigurations();
    console.log(
        `${allUserConfigurations.length} user configurations fetched! Inserting them in database...`,
    );
    const userConfigurationIdMapping: userConfigurationIdMappingType = {};
    await Promise.all(
        allUserConfigurations.map(async (userConfiguration) => {
            const distantUserConfigurationId = userConfiguration.id;
            const result = await userConfigurationRepository.insert(userConfiguration);

            const localUserConfigurationId = result.identifiers[0].id as number;
            userConfigurationIdMapping[distantUserConfigurationId] = localUserConfigurationId;
        }),
    );

    console.log('User configurations inserted! Now fetching users...');
    const allUsers = await api.fetchAllUsers();
    console.log(`${allUsers.length} users fetched! Inserting them in database...`);

    await userRepository.insert(
        allUsers.map((user) => ({
            ...user,
            userConfiguration: { id: userConfigurationIdMapping[user.userConfiguration.id] },
        })),
    );
    await userRepository.update(
        {},
        { hashedPassword: '7b155b65c3ecb88501347988ab889b021c4c891e547976b27e2419734117240b' }, // "test"
    );
    console.log('Users inserted!');

    console.log('Now fetching establishments...');

    const allEstablishments = await api.fetchAllEstablishments();

    console.log(
        `${allEstablishments.length} establishments fetched! Inserting them in database...`,
    );

    await establishmentRepository.insert(allEstablishments);

    console.log('Establishments inserted!');
    console.log('Now fetching classes...');

    const allClasses = await api.fetchAllClasses();

    console.log(`${allClasses.length} classes fetched! Inserting them in database...`);

    await classeRepository.insert(allClasses);

    console.log('Classes inserted!');
    console.log('Now fetching students...');

    const allStudents = await api.fetchAllStudents();

    console.log(`${allStudents.length} students fetched! Inserting them in database...`);

    await studentRepository.insert(allStudents);

    console.log('Students inserted!');
    console.log('Now fetching exams...');
    const allExams = await api.fetchAllExams();
    console.log(`${allExams.length} exams fetched! Inserting them in database...`);

    const questionIdMapping: questionIdMappingType = {};
    for (const exam of allExams) {
        await examRepository.insert(exam);
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
    console.log('Exams inserted!');
    console.log('Now fetching attempts...');

    const allAttempts = await api.fetchAllAttempts();

    console.log(`${allAttempts.length} attempts fetched! Inserting them in database...`);

    for (const attempt of allAttempts) {
        const translatedAnswers = replaceQuestionIdInAnswers(attempt.answers, questionIdMapping);
        const translatedMarks = replaceQuestionIdInMarks(attempt.manualMarks, questionIdMapping);
        await attemptRepository.insert({
            ...attempt,
            answers: translatedAnswers,
            manualMarks: translatedMarks,
        });
    }
    console.log('Done!');
}

function replaceQuestionIdInAnswers(
    answers: Attempt['answers'],
    questionIdMapping: questionIdMappingType,
): Attempt['answers'] {
    const ANSWER_REGEX = /(\d+):(.*)/;
    const attemptAnswers = answers
        .map((answer) => {
            let regexMatch = answer.match(ANSWER_REGEX);
            if (!regexMatch) {
                throw new Error(`answer "${answer}" is wrongly formatted.`);
            }
            const [_, distantQuestionId, encodedQuestionAnswer] = regexMatch;
            const localQuestionId = questionIdMapping[Number(distantQuestionId)];
            if (localQuestionId === undefined) {
                return '';
            }
            return `${localQuestionId}:${encodedQuestionAnswer}`;
        })
        .filter(Boolean);
    return attemptAnswers;
}

function replaceQuestionIdInMarks(
    manualMarks: Attempt['manualMarks'],
    questionIdMapping: questionIdMappingType,
): Attempt['answers'] {
    const MARK_REGEX = /^(\d+):(\d\.?\d*)$/;
    const newManualMarks = manualMarks
        .map((manualMark) => {
            let regexMatch = manualMark.match(MARK_REGEX);
            if (!regexMatch || regexMatch.length !== 3 || isNaN(Number(regexMatch[1]))) {
                throw new Error(`manualMark "${manualMark}" is wrongly formatted.`);
            }
            const [_, distantQuestionId, mark] = regexMatch;
            const localQuestionId = questionIdMapping[Number(distantQuestionId)];
            if (localQuestionId === undefined) {
                return '';
            }
            return `${localQuestionId}:${mark}`;
        })
        .filter(Boolean);
    return newManualMarks;
}

importDb();
