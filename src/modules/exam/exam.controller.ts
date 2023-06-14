import { Exam } from './Exam.entity';
import { buildExamService } from './exam.service';

export { buildExamController };

function buildExamController() {
    const examService = buildExamService();
    const examController = {
        createExam,
        getExams,
        getExam,
    };

    return examController;

    async function createExam(params: { body: { name: string } }) {
        const exam = new Exam();
        exam.name = params.body.name;
        return examService.createExam(exam.name);
    }

    async function getExams() {
        return examService.getExams();
    }

    async function getExam(params: { urlParams: { examId: string } }) {
        return examService.getExam(params.urlParams.examId);
    }
}
