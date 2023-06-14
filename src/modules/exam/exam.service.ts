import { DataSource } from 'typeorm';
import { Exam } from './Exam.entity';

export { buildExamService };

function buildExamService(dataSource: DataSource) {
    const examRepository = dataSource.getRepository(Exam);
    const examService = {
        createExam,
    };

    return examService;

    async function createExam(name: string) {
        const exam = new Exam();
        exam.name = name;
        return examRepository.save(exam);
    }
}
