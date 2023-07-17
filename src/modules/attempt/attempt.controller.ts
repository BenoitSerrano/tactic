import { buildAttemptService } from './attempt.service';

export { buildAttemptController };

function buildAttemptController() {
    const attemptService = buildAttemptService();
    const attemptController = {
        createAttempt,
        createEmptyAttempt,
        searchAttempts,
        fetchAttempt,
        fetchAttemptWithoutAnswers,
        deleteAttempt,
        updateAttemptTreatmentStatus,
    };

    return attemptController;

    async function searchAttempts(params: { urlParams: { examId: string; studentId: string } }) {
        return attemptService.searchAttempts(params.urlParams.examId, params.urlParams.studentId);
    }

    async function createAttempt(params: { urlParams: { examId: string; studentId: string } }) {
        return attemptService.createAttempt(params.urlParams.examId, params.urlParams.studentId);
    }

    async function createEmptyAttempt(params: {
        urlParams: { examId: string; studentId: string };
    }) {
        return attemptService.createEmptyAttempt(
            params.urlParams.examId,
            params.urlParams.studentId,
        );
    }

    async function fetchAttempt(params: { urlParams: { attemptId: string } }) {
        return attemptService.fetchAttempt(params.urlParams.attemptId);
    }

    async function fetchAttemptWithoutAnswers(params: { urlParams: { attemptId: string } }) {
        return attemptService.fetchAttemptWithoutAnswers(params.urlParams.attemptId);
    }

    async function deleteAttempt(params: { urlParams: { attemptId: string } }) {
        return attemptService.deleteAttempt(params.urlParams.attemptId);
    }

    async function updateAttemptTreatmentStatus(params: {
        urlParams: { attemptId: string };
        body: { hasBeenTreated: boolean };
    }) {
        return attemptService.updateAttemptTreatmentStatus(
            params.urlParams.attemptId,
            params.body.hasBeenTreated,
        );
    }
}
