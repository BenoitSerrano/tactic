import { buildAttemptService } from './attempt.service';

export { buildAttemptController };

function buildAttemptController() {
    const attemptService = buildAttemptService();
    const attemptController = {
        createAttempt,
        createEmptyAttempt,
        searchAttempts,
        fetchAttempt,
        endAttempt,
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

    async function endAttempt(params: { urlParams: { attemptId: string } }) {
        return attemptService.endAttempt(params.urlParams.attemptId);
    }
}
