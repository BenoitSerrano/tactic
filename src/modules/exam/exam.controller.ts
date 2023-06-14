import { Exam } from './Exam.entity';
import { QuestionChoixMultiple } from '../questionChoixMultiple';
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

    async function createQuestionChoixMultiple(params: { urlParams: { examId: string } }) {
        const questionChoixMultiple = new QuestionChoixMultiple();
        questionChoixMultiple.possibleAnswers = ['', '', '', ''];
        questionChoixMultiple.rightAnswerIndex = 0;
        questionChoixMultiple.title = '';
    }
}
