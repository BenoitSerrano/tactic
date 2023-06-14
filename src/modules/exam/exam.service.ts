import { DataSource } from 'typeorm';
import { Exam } from './Exam.entity';

export { buildExamService };

function buildExamService(dataSource: DataSource) {
    const examRepository = dataSource.getRepository(Exam);
    const examService = {
        createEmptyExam,
    };

    return examService;

    async function createEmptyExam() {
        const exam = new Exam();
        return examRepository.save(exam);
    }
}
