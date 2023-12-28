import { gradeType } from '../question/types';
import { buildAttemptService } from './attempt.service';
import { attemptAnswersType } from './types';

export { buildAttemptController };

function buildAttemptController() {
    const attemptService = buildAttemptService();
    const attemptController = {
        getAllAttempts,
        createAttempt,
        updateAttempt,
        searchAttempts,
        fetchAttemptWithAnswers,
        fetchAttemptWithoutAnswers,
        deleteAttempt,
        updateAttemptCheatingSummary,
        updateGrade,
        updateAttemptEndedAt,
        deleteAttemptEndedAt,
        updateAttemptCorrectedAt,
        deleteAttemptCorrectedAt,
        fetchAttemptsCountByCorrectionStatus,
    };

    return attemptController;

    async function getAllAttempts() {
        return attemptService.getAllAttempts();
    }

    async function searchAttempts(params: { urlParams: { examId: string; studentId: string } }) {
        return attemptService.searchAttempts(params.urlParams.examId, params.urlParams.studentId);
    }

    async function updateAttempt(params: {
        urlParams: { attemptId: string };
        body: attemptAnswersType;
    }) {
        return attemptService.updateAttempt(params.urlParams.attemptId, params.body);
    }

    async function createAttempt(params: { urlParams: { examId: string; studentId: string } }) {
        return attemptService.createAttempt(params.urlParams.examId, params.urlParams.studentId);
    }

    async function fetchAttemptWithAnswers(params: { urlParams: { attemptId: string } }) {
        return attemptService.fetchAttemptWithAnswers(params.urlParams.attemptId);
    }

    async function fetchAttemptWithoutAnswers(params: { urlParams: { attemptId: string } }) {
        return attemptService.fetchAttemptWithoutAnswers(params.urlParams.attemptId);
    }

    async function deleteAttempt(params: { urlParams: { attemptId: string } }) {
        return attemptService.deleteAttempt(params.urlParams.attemptId);
    }

    async function updateGrade(params: {
        urlParams: { attemptId: string; questionId: string };
        body: { grade: gradeType };
    }) {
        return attemptService.updateGrade(
            params.urlParams.attemptId,
            Number(params.urlParams.questionId),
            params.body.grade,
        );
    }

    async function updateAttemptCheatingSummary(params: {
        urlParams: { attemptId: string };
        body: { roundTrips: number; timeSpentOutside: number };
    }) {
        return attemptService.updateAttemptCheatingSummary(params.urlParams.attemptId, params.body);
    }

    async function updateAttemptEndedAt(params: { urlParams: { attemptId: string } }) {
        return attemptService.updateAttemptEndedAt(params.urlParams.attemptId);
    }

    async function deleteAttemptEndedAt(params: { urlParams: { attemptId: string } }) {
        return attemptService.deleteAttemptEndedAt(params.urlParams.attemptId);
    }

    async function updateAttemptCorrectedAt(params: { urlParams: { attemptId: string } }) {
        return attemptService.updateAttemptCorrectedAt(params.urlParams.attemptId);
    }

    async function deleteAttemptCorrectedAt(params: { urlParams: { attemptId: string } }) {
        return attemptService.deleteAttemptCorrectedAt(params.urlParams.attemptId);
    }

    async function fetchAttemptsCountByCorrectionStatus(params: { urlParams: { examId: string } }) {
        return attemptService.fetchAttemptsCountByCorrectionStatus(params.urlParams.examId);
    }
}
