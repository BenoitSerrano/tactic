import { Classe } from '../classe';
import { Establishment } from '../establishment';
import { User } from '../user';
import { Exam } from './Exam.entity';
import { buildExamService } from './exam.service';
import { examEdgeTextKind } from './types';

export { buildExamController };

function buildExamController() {
    const examService = buildExamService();
    const examController = {
        createExam,
        updateExamDuration,
        updateExamName,
        updateExamEdgeText,
        getExamsByEstablishment,
        getExamsByUser,
        getExam,
        getExamWithoutAnswers,
        getAllExams,
        getExamResults,
        deleteExam,
        duplicateExam,
        getExamWithQuestions,
        fetchShouldDisplayRightAnswersForExamId,
        updateShouldDisplayRightAnswersForExamId,
        updateClasseId,
    };

    return examController;

    async function createExam(
        params: {
            urlParams: { classeId: string };
            body: {
                name: string;
                duration: number | null;
                startDateTime: number;
                endDateTime: number | null;
            };
        },
        user: User,
    ) {
        return examService.createExam({
            name: params.body.name,
            duration: params.body.duration,
            classeId: params.urlParams.classeId,
            user,
            startDateTime: params.body.startDateTime,
            endDateTime: params.body.endDateTime,
        });
    }

    async function updateExamName(params: {
        urlParams: { examId: Exam['id'] };
        body: { name: string };
    }) {
        return examService.updateExamName(params.urlParams.examId, params.body.name);
    }

    async function updateExamEdgeText(params: {
        urlParams: { examId: Exam['id'] };
        body: { kind: examEdgeTextKind; text: string };
    }) {
        return examService.updateExamEdgeText(
            params.urlParams.examId,
            params.body.kind,
            params.body.text,
        );
    }

    async function updateExamDuration(params: {
        urlParams: { examId: Exam['id'] };
        body: { duration: number | null };
    }) {
        return examService.updateExamDuration(params.urlParams.examId, params.body.duration);
    }

    async function getExamsByEstablishment(
        params: {
            urlParams: { establishmentId: Establishment['id'] };
        },
        user: User,
    ) {
        return examService.getExamsByEstablishment({
            userId: user.id,
            establishmentId: params.urlParams.establishmentId,
        });
    }

    async function getExamsByUser(params: { urlParams: { userId: string } }) {
        return examService.getExamsByUser(params.urlParams.userId);
    }

    async function getExam(params: { urlParams: { examId: string } }) {
        return examService.getExam(params.urlParams.examId);
    }

    async function getExamWithoutAnswers(params: { urlParams: { examId: string } }) {
        return examService.getExamWithoutAnswers(params.urlParams.examId);
    }

    async function getExamResults(params: { urlParams: { examId: string } }) {
        return examService.getExamResults(params.urlParams.examId);
    }

    async function getAllExams() {
        return examService.getAllExams();
    }

    async function getExamWithQuestions(params: { urlParams: { examId: string } }) {
        return examService.getExamWithQuestions(params.urlParams.examId);
    }

    async function deleteExam(params: { urlParams: { examId: string } }) {
        return examService.deleteExam(params.urlParams.examId);
    }

    async function duplicateExam(params: { urlParams: { examId: string } }, user: User) {
        return examService.duplicateExam({ examId: params.urlParams.examId, user });
    }

    async function fetchShouldDisplayRightAnswersForExamId(params: {
        urlParams: { examId: Exam['id'] };
    }) {
        return examService.fetchShouldDisplayRightAnswersForExamId(params.urlParams.examId);
    }

    async function updateShouldDisplayRightAnswersForExamId(params: {
        urlParams: { examId: Exam['id'] };
        body: { shouldDisplayRightAnswers: boolean };
    }) {
        return examService.updateShouldDisplayRightAnswersForExamId(
            params.urlParams.examId,
            params.body.shouldDisplayRightAnswers,
        );
    }

    async function updateClasseId(params: {
        body: { classeId: Classe['id'] };
        urlParams: { examId: Exam['id'] };
    }) {
        return examService.updateClasseId(
            { examId: params.urlParams.examId },
            params.body.classeId,
        );
    }
}
