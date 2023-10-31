import { dataSource } from '../dataSource';
import { api } from '../lib/api';
import { Exam } from '../modules/exam';
import { Exercise } from '../modules/exercise';
import { Question } from '../modules/question';

async function importAllExams() {
    await dataSource.initialize();
    const examRepository = dataSource.getRepository(Exam);
    const exerciseRepository = dataSource.getRepository(Exercise);
    const questionRepository = dataSource.getRepository(Question);
    const allExams = await api.fetchAllExams();
    for (const exam of allExams) {
        await examRepository.insert(exam);
        for (const exercise of exam.exercises) {
            const result = await exerciseRepository.insert({ ...exercise, exam: { id: exam.id } });
            const exerciseId = result.identifiers[0].id;
            for (const question of exercise.questions) {
                await questionRepository.insert({ ...question, exercise: { id: exerciseId } });
            }
        }
    }
}

importAllExams();
