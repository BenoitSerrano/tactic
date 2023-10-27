import { Question } from '../question';
import { buildAttemptService } from './attempt.service';
import { attemptAnswersType } from './types';

export { buildAttemptController };

function buildAttemptController() {
    const attemptService = buildAttemptService();
    const attemptController = {
        createAttempt,
        updateAttempt,
        searchAttempts,
        fetchAttemptWithAnswers,
        fetchAttemptWithoutAnswers,
        deleteAttempt,
        updateAttemptCheatingSummary,
        updateMarks,
    };

    return attemptController;

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

    async function updateMarks(params: {
        urlParams: { attemptId: string };
        body: { marks: Record<Question['id'], number> };
    }) {
        return attemptService.updateMarks(params.urlParams.attemptId, params.body.marks);
    }

    async function updateAttemptCheatingSummary(params: {
        urlParams: { attemptId: string };
        body: { roundTrips: number; timeSpentOutside: number };
    }) {
        return attemptService.updateAttemptCheatingSummary(params.urlParams.attemptId, params.body);
    }
}
