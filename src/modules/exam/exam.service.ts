import { Exam } from './Exam.entity';
import { dataSource } from '../../dataSource';

export { buildExamService };

function buildExamService() {
    const examRepository = dataSource.getRepository(Exam);
    const examService = {
        createExam,
        getExams,
        getExam,
    };

    return examService;

    async function createExam(params: { body: { name: string } }) {
        const exam = new Exam();
        exam.name = params.body.name;
        return examRepository.save(exam);
    }

    async function getExams() {
        return examRepository.find();
    }

    async function getExam(params: { urlParams: { examId: string } }) {
        console.log(params.urlParams.examId);
        return examRepository.find({ where: { id: params.urlParams.examId } });
    }
}
