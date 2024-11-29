import { BASE_URL } from './constants';
import { performApiCall } from './lib/performApiCall';

const attemptsApi = {
    searchAttempt,
    getAttemptsCountByCorrectionStatus,
    getAttemptWithAnswers,
    getAttemptWithoutAnswers,
    createAttempt,
    updateAttempt,
    updateAttemptCheatingSummary,
    updateManualMark,
    updateAttemptEndedAt,
    updateAttemptCorrectedAt,
    deleteAttemptEndedAt,
    deleteAttemptCorrectedAt,
    deleteAttempt,
};

async function searchAttempt({ examId, studentId }: { examId: string; studentId: string }) {
    const URL = `${BASE_URL}/exams/${examId}/students/${studentId}/attempts`;
    return performApiCall(URL, 'GET');
}

type attemptsCountByAttemptStatusApiType = {
    corrected: number;
    notCorrected: number;
};

async function getAttemptsCountByCorrectionStatus(params: {
    examId: string;
}): Promise<attemptsCountByAttemptStatusApiType> {
    const URL = `${BASE_URL}/exams/${params.examId}/attempts/count-by-correction-status`;
    return performApiCall(URL, 'GET');
}

async function getAttemptWithAnswers(params: { attemptId: string }) {
    const URL = `${BASE_URL}/attempts/${params.attemptId}/with-answers`;
    return performApiCall(URL, 'GET');
}

async function getAttemptWithoutAnswers(attemptId: string) {
    const URL = `${BASE_URL}/attempts/${attemptId}/without-answers`;
    return performApiCall(URL, 'GET');
}

async function createAttempt({ examId, studentId }: { examId: string; studentId: string }) {
    const URL = `${BASE_URL}/exams/${examId}/students/${studentId}/attempts`;
    return performApiCall(URL, 'POST', {});
}

async function updateAttempt({
    attemptId,
    answers,
}: {
    attemptId: string;
    answers: Record<number, string>;
}) {
    const URL = `${BASE_URL}/attempts/${attemptId}`;
    return performApiCall(URL, 'PUT', answers);
}

async function updateAttemptCheatingSummary({
    attemptId,
    roundTrips,
    timeSpentOutside,
}: {
    attemptId: string;
    roundTrips: number;
    timeSpentOutside: number;
}) {
    const URL = `${BASE_URL}/attempts/${attemptId}/cheating-summary`;
    return performApiCall(URL, 'PATCH', { roundTrips, timeSpentOutside });
}

async function updateManualMark(params: {
    examId: string;
    attemptId: string;
    questionId: number;
    manualMark: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/attempts/${params.attemptId}/questions/${params.questionId}/manual-mark`;
    return performApiCall(URL, 'PATCH', {
        manualMark: params.manualMark,
    });
}

async function updateAttemptEndedAt(params: { attemptId: string }) {
    const URL = `${BASE_URL}/attempts/${params.attemptId}/endedAt`;
    return performApiCall(URL, 'PATCH');
}

async function updateAttemptCorrectedAt(params: { attemptId: string; examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/attempts/${params.attemptId}/correctedAt`;
    return performApiCall(URL, 'PATCH');
}

async function deleteAttemptEndedAt(params: { attemptId: string; examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/attempts/${params.attemptId}/endedAt`;
    return performApiCall(URL, 'DELETE');
}

async function deleteAttemptCorrectedAt(params: { attemptId: string; examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/attempts/${params.attemptId}/correctedAt`;
    return performApiCall(URL, 'DELETE');
}

async function deleteAttempt(params: { attemptId: string; examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/attempts/${params.attemptId}`;
    return performApiCall(URL, 'DELETE');
}

export { attemptsApi };
export type { attemptsCountByAttemptStatusApiType };
