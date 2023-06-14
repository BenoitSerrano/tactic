import { Exam } from './Exam.entity';
import { dataSource } from '../../dataSource';
import { QuestionChoixMultiple } from '../questionChoixMultiple';

export { buildExamService };

function buildExamService() {
    const examRepository = dataSource.getRepository(Exam);
    const examService = {
        createExam,
        getExams,
        getExam,
    };

    return examService;

    async function createExam(name: string) {
        const exam = new Exam();
        exam.name = name;
        return examRepository.save(exam);
    }

    async function getExams() {
        return examRepository.find();
    }

    async function getExam(examId: string) {
        return examRepository.findOneOrFail({ where: { id: examId } });
    }
}
