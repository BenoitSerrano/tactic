import { User } from '../user';
import { Exam } from './Exam.entity';
import { buildExamService } from './exam.service';

export { buildExamController };

function buildExamController() {
    const examService = buildExamService();
    const examController = {
        createExam,
        updateExam,
        getExams,
        getExam,
        getExamResults,
        deleteExam,
    };

    return examController;

    async function createExam(
        params: {
            body: { name: string; duration: number; extraTime: number };
        },
        user?: User,
    ) {
        return examService.createExam(params.body.name, params.body.duration, user);
    }

    async function updateExam(params: {
        urlParams: { examId: Exam['id'] };
        body: { name: string; duration: number; extraTime: number };
    }) {
        return examService.updateExam(params.urlParams.examId, {
            name: params.body.name,
            duration: params.body.duration,
        });
    }

    async function getExams(_params: {}, user?: User) {
        return examService.getExams(user);
    }

    async function getExam(params: { urlParams: { examId: string } }) {
        return examService.getExamExercises(params.urlParams.examId);
    }

    async function getExamResults(params: { urlParams: { examId: string } }) {
        return examService.getExamResults(params.urlParams.examId);
    }

    async function deleteExam(params: { urlParams: { examId: string } }) {
        return examService.deleteExam(params.urlParams.examId);
    }
}
