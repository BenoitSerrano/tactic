import { dataSource } from '../dataSource';
import { api } from '../lib/api';
import { Attempt } from '../modules/attempt';
import { Exam } from '../modules/exam';
import { Exercise } from '../modules/exercise';
import { Group } from '../modules/group';
import { Question } from '../modules/question';
import { Student } from '../modules/student';
import { User } from '../modules/user';

async function importDb() {
    await dataSource.initialize();
    const userRepository = dataSource.getRepository(User);
    const examRepository = dataSource.getRepository(Exam);
    const exerciseRepository = dataSource.getRepository(Exercise);
    const studentRepository = dataSource.getRepository(Student);
    const attemptRepository = dataSource.getRepository(Attempt);
    const groupRepository = dataSource.getRepository(Group);
    const questionRepository = dataSource.getRepository(Question);
    const user = await userRepository.findOneOrFail({ where: {} });

    const allExams = await api.fetchAllExams();
    for (const exam of allExams) {
        await examRepository.insert({ ...exam, user });
        for (const exercise of exam.exercises) {
            const result = await exerciseRepository.insert({ ...exercise, exam: { id: exam.id } });
            const exerciseId = result.identifiers[0].id;
            for (const question of exercise.questions) {
                await questionRepository.insert({ ...question, exercise: { id: exerciseId } });
            }
        }
    }

    const allGroups = await api.fetchAllGroups();
    for (const group of allGroups) {
        await groupRepository.insert({ ...group, user });
    }

    const allStudents = await api.fetchAllStudents();
    for (const student of allStudents) {
        await studentRepository.insert({ ...student });
    }

    const allAttempts = await api.fetchAllAttempts();
    for (const attempt of allAttempts) {
        await attemptRepository.insert({ ...attempt });
    }
}

importDb();
