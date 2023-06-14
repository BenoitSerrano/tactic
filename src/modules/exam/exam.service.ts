import { Exam } from './Exam.entity';
import { dataSource } from '../../dataSource';

export { buildExamService };

function buildExamService() {
    const examRepository = dataSource.getRepository(Exam);
    const examService = {
        createExam,
        getExams,
    };

    return examService;

    async function createExam(examDto: { name: string }) {
        const exam = new Exam();
        exam.name = examDto.name;
        return examRepository.save(exam);
    }

    async function getExams() {
        return examRepository.find();
    }
}
