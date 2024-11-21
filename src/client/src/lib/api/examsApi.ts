import { BASE_URL } from './constants';
import { exerciseWithQuestionsType } from './exercisesApi';
import { performApiCall } from './lib/performApiCall';

const examsApi = {
    getExamsByClasse,
    getExamsByUser,
    getExam,
    getExamWithQuestions,
    getExamWithoutAnswers,
    getExamResults,
    getShouldDisplayRightAnswersForExamId,
    createExam,
    duplicateExam,
    updateExamName,
    updateExamDateTimeRange,
    updateExamEdgeText,
    updateExamDuration,
    updateShouldDisplayRightAnswersForExamId,
    updateClasseId,
    deleteExam,
};

async function getExamsByClasse(params: {
    establishmentId: string | undefined;
    classeId: string | undefined;
}) {
    const URL = computeUrl();
    return performApiCall(URL, 'GET');

    function computeUrl() {
        if (params.establishmentId === undefined || params.establishmentId === undefined) {
            return `${BASE_URL}/exams`;
        }
        return `${BASE_URL}/establishments/${params.establishmentId}/classes/${params.classeId}/exams`;
    }
}

async function getExamsByUser(userId: string) {
    const URL = `${BASE_URL}/users/${userId}/exams`;
    return performApiCall(URL, 'GET');
}

async function getExam(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}`;
    return performApiCall(URL, 'GET');
}

type examWithQuestionsApiType = {
    id: string;
    name: string;
    exercises: Array<exerciseWithQuestionsType>;
};

async function getExamWithQuestions(examId: string): Promise<examWithQuestionsApiType> {
    const URL = `${BASE_URL}/exams/${examId}/with-questions`;
    return performApiCall(URL, 'GET');
}

async function getExamWithoutAnswers(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}/without-answers`;
    return performApiCall(URL, 'GET');
}

async function getExamResults(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}/results`;
    return performApiCall(URL, 'GET');
}

async function getShouldDisplayRightAnswersForExamId(params: { examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/shouldDisplayRightAnswers`;
    return performApiCall(URL, 'GET');
}

async function createExam({
    name,
    duration,
    classeId,
    startDateTime,
    endDateTime,
}: {
    name: string;
    duration: number | undefined;
    classeId: string;
    startDateTime: number;
    endDateTime: number;
}) {
    const URL = `${BASE_URL}/classes/${classeId}/exams`;
    return performApiCall(URL, 'POST', {
        name,
        duration,
        startDateTime,
        endDateTime: endDateTime === Infinity ? null : endDateTime,
    });
}

async function duplicateExam(params: { examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/duplicate`;
    return performApiCall(URL, 'POST');
}

async function updateExamName({ examId, name }: { examId: string; name: string }) {
    const URL = `${BASE_URL}/exams/${examId}/name`;
    return performApiCall(URL, 'PATCH', { name });
}

async function updateExamDateTimeRange({
    examId,
    startDateTime,
    endDateTime,
}: {
    examId: string;
    startDateTime: number;
    endDateTime: number;
}) {
    const URL = `${BASE_URL}/exams/${examId}/dateTimeRange`;
    return performApiCall(URL, 'PATCH', {
        startDateTime,
        endDateTime: endDateTime === Infinity ? null : endDateTime,
    });
}

async function updateExamEdgeText({
    examId,
    kind,
    text,
}: {
    examId: string;
    kind: 'start' | 'end';
    text: string;
}) {
    const URL = `${BASE_URL}/exams/${examId}/edgeText`;
    return performApiCall(URL, 'PATCH', { kind, text });
}

async function updateExamDuration({
    examId,
    duration,
}: {
    examId: string;
    duration: number | null;
}) {
    const URL = `${BASE_URL}/exams/${examId}/duration`;
    return performApiCall(URL, 'PATCH', { duration });
}

async function updateShouldDisplayRightAnswersForExamId(params: {
    examId: string;
    shouldDisplayRightAnswers: boolean;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/shouldDisplayRightAnswers`;
    return performApiCall(URL, 'PATCH', {
        shouldDisplayRightAnswers: params.shouldDisplayRightAnswers,
    });
}

async function updateClasseId(params: { classeId: string; examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/classeId`;
    return performApiCall(URL, 'PATCH', { classeId: params.classeId });
}

async function deleteExam(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}`;
    return performApiCall(URL, 'DELETE');
}

export { examsApi };
