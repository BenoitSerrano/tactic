import { buildAttemptService } from './attempt.service';

export { buildAttemptController };

function buildAttemptController() {
    const attemptService = buildAttemptService();
    const attemptController = {
        findOrCreateAttempt,
        fetchAttempt,
    };

    return attemptController;

    async function findOrCreateAttempt(params: {
        urlParams: { examId: string; studentId: string };
    }) {
        return attemptService.findOrCreateAttempt(
            params.urlParams.examId,
            params.urlParams.studentId,
        );
    }

    async function fetchAttempt(params: { urlParams: { attemptId: string } }) {
        return attemptService.fetchAttempt(params.urlParams.attemptId);
    }
}
