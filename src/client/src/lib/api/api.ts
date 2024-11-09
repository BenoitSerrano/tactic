import { config } from '../../config';
import { acceptableAnswerType, examFilterType, questionKindType } from '../../types';
import { localSessionHandler } from '../localSessionHandler';

const api = {
    login,
    createUser,
    searchAttempt,
    createAttempt,
    fetchAttemptWithAnswers,
    fetchAttemptWithoutAnswers,
    fetchExamWithoutAnswers,
    updateAttempt,
    updateAttemptCheatingSummary,
    deleteAttempt,
    fetchStudents,
    fetchStudent,
    updateStudentNames,
    fetchStudentByEmailForExam,
    createStudents,
    deleteStudent,
    createExam,
    fetchExam,
    fetchExamWithQuestions,
    updateExamName,
    updateExamDuration,
    updateExamEdgeText,
    updateDefaultEdgeText,
    fetchExams,
    fetchExamResults,
    deleteExam,
    archiveExam,
    unarchiveExam,
    createQuestion,
    createExercise,
    updateExercise,
    deleteExercise,
    updateQuestion,
    addQuestionAcceptableAnswer,
    addQuestionAcceptableAnswerToTexteATrous,
    removeOkAnswer,
    removeOkAnswerFromTexteATrous,
    deleteQuestion,
    duplicateQuestion,
    updateQuestionsOrder,
    updateManualMark,
    updateExercisesOrder,
    updateEndedAt,
    deleteEndedAt,
    updateCorrectedAt,
    deleteCorrectedAt,
    createResetPasswordRequest,
    fetchResetPasswordRequestUser,
    resetPassword,
    fetchAttemptsCountByCorrectionStatus,
    fetchClassesByEstablishment,
    createClasse,
    deleteClasse,
    changeClasse,
    duplicateExam,
    fetchShouldDisplayRightAnswersForExamId,
    updateShouldDisplayRightAnswersForExamId,
    fetchUsersSummary,
    fetchUserExams,
    fetchEstablishments,
    createEstablishment,
    updateEstablishment,
    updateEstablishmentId,
    updateClasseId,
};

const BASE_URL = `${config.API_URL}/api`;

async function performApiCall(
    url: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    body?: Object,
) {
    let response: Response;
    const token = localSessionHandler.getToken();

    if (method === 'GET') {
        response = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` } });
    } else {
        const headers: Record<string, string> = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        response = await fetch(url, {
            method,
            headers,
            body: JSON.stringify(body),
        });
    }
    if (!response.ok) {
        if (response.status === 401) {
            localSessionHandler.logout();
        }
        let message = response.statusText;
        try {
            message = await response.text();
        } catch (error) {
            console.error(error);
        } finally {
            throw new Error(message);
        }
    }
    return response.json();
}

async function fetchEstablishments(): Promise<Array<{ id: string; name: string }>> {
    const URL = `${BASE_URL}/establishments`;
    return performApiCall(URL, 'GET');
}

async function createEstablishment(params: {
    name: string;
}): Promise<{ id: string; name: string }> {
    const URL = `${BASE_URL}/establishments`;
    return performApiCall(URL, 'POST', { name: params.name });
}

async function updateEstablishment(params: {
    establishmentId: string;
    name: string;
}): Promise<{ id: string; name: string }> {
    const URL = `${BASE_URL}/establishments/${params.establishmentId}`;
    return performApiCall(URL, 'PUT', { name: params.name });
}

async function updateEstablishmentId(params: { establishmentId: string; classeId: string }) {
    const URL = `${BASE_URL}/classes/${params.classeId}/establishmentId`;
    return performApiCall(URL, 'PATCH', { establishmentId: params.establishmentId });
}

async function updateClasseId(params: { classeId: string; examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/classeId`;
    return performApiCall(URL, 'PATCH', { classeId: params.classeId });
}

async function fetchUsersSummary() {
    const URL = `${BASE_URL}/users-summary`;
    return performApiCall(URL, 'GET');
}

async function fetchUserExams(userId: string) {
    const URL = `${BASE_URL}/users/${userId}/exams`;
    return performApiCall(URL, 'GET');
}

async function createUser(params: { email: string; password: string }) {
    const URL = `${BASE_URL}/users`;
    return performApiCall(URL, 'POST', { email: params.email, password: params.password });
}

async function login(params: { email: string; password: string }) {
    const URL = `${BASE_URL}/login`;
    return performApiCall(URL, 'POST', { email: params.email, password: params.password });
}

async function searchAttempt({ examId, studentId }: { examId: string; studentId: string }) {
    const URL = `${BASE_URL}/exams/${examId}/students/${studentId}/attempts`;
    return performApiCall(URL, 'GET');
}

async function createAttempt({ examId, studentId }: { examId: string; studentId: string }) {
    const URL = `${BASE_URL}/exams/${examId}/students/${studentId}/attempts`;
    return performApiCall(URL, 'POST', {});
}

async function fetchAttemptWithAnswers(params: { attemptId: string }) {
    const URL = `${BASE_URL}/attempts/${params.attemptId}/with-answers`;
    return performApiCall(URL, 'GET');
}

async function fetchExamWithoutAnswers(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}/without-answers`;
    return performApiCall(URL, 'GET');
}

async function fetchAttemptWithoutAnswers(attemptId: string) {
    const URL = `${BASE_URL}/attempts/${attemptId}/without-answers`;
    return performApiCall(URL, 'GET');
}

// TODO: ajouter l'exerciseId pour s'assurer qu'on est pas en train de faire de la merde
async function addQuestionAcceptableAnswer({
    examId,
    questionId,
    acceptableAnswer,
}: {
    examId: string;
    questionId: number;
    acceptableAnswer: acceptableAnswerType;
}) {
    const URL = `${BASE_URL}/exams/${examId}/questions/${questionId}/acceptable-answers`;
    return performApiCall(URL, 'POST', { acceptableAnswer });
}

// TODO: ajouter l'exerciseId pour s'assurer qu'on est pas en train de faire de la merde
async function addQuestionAcceptableAnswerToTexteATrous({
    examId,
    questionId,
    acceptableAnswer,
    blankIndex,
}: {
    examId: string;
    questionId: number;
    acceptableAnswer: acceptableAnswerType;
    blankIndex: number;
}) {
    const URL = `${BASE_URL}/exams/${examId}/questions/${questionId}/tat-acceptable-answers`;
    return performApiCall(URL, 'POST', { acceptableAnswer, blankIndex });
}

// TODO: ajouter l'exerciseId pour s'assurer qu'on est pas en train de faire de la merde
async function removeOkAnswer({
    examId,
    questionId,
    okAnswer,
}: {
    examId: string;
    questionId: number;
    okAnswer: string;
}) {
    const URL = `${BASE_URL}/exams/${examId}/questions/${questionId}/ok-answers`;
    return performApiCall(URL, 'DELETE', { okAnswer });
}

async function removeOkAnswerFromTexteATrous({
    examId,
    questionId,
    okAnswer,
    blankIndex,
}: {
    examId: string;
    questionId: number;
    okAnswer: string;
    blankIndex: number;
}) {
    const URL = `${BASE_URL}/exams/${examId}/questions/${questionId}/tat-ok-answers`;
    return performApiCall(URL, 'DELETE', { okAnswer, blankIndex });
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

async function deleteAttempt(params: { attemptId: string; examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/attempts/${params.attemptId}`;
    return performApiCall(URL, 'DELETE');
}

async function fetchStudentByEmailForExam(params: { email: string; examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/students/${params.email}`;
    return performApiCall(URL, 'GET');
}

async function deleteStudent(params: { studentId: string; classeId: string }) {
    const URL = `${BASE_URL}/classes/${params.classeId}/students/${params.studentId}`;
    return performApiCall(URL, 'DELETE');
}

async function fetchStudents(params: { classeId: string }) {
    const URL = `${BASE_URL}/classes/${params.classeId}/students`;
    return performApiCall(URL, 'GET');
}

async function fetchStudent(params: { studentId: string }) {
    const URL = `${BASE_URL}/students/${params.studentId}`;
    return performApiCall(URL, 'GET');
}

async function updateStudentNames(params: {
    studentId: string;
    firstName?: string;
    lastName?: string;
}) {
    const URL = `${BASE_URL}/students/${params.studentId}/names`;
    return performApiCall(URL, 'PATCH', { firstName: params.firstName, lastName: params.lastName });
}

async function createStudents(params: { emails: string[]; classeId: string }) {
    const URL = `${BASE_URL}/classes/${params.classeId}/students`;
    return performApiCall(URL, 'POST', { emails: params.emails });
}

async function fetchExams(params: { filter: examFilterType; establishmentId: string }) {
    const URL = `${BASE_URL}/establishments/${params.establishmentId}/exams?filter=${params.filter}`;
    return performApiCall(URL, 'GET');
}

async function deleteExam(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}`;
    return performApiCall(URL, 'DELETE');
}

async function archiveExam(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}/archivedAt`;
    return performApiCall(URL, 'PATCH', { archive: true });
}

async function unarchiveExam(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}/archivedAt`;
    return performApiCall(URL, 'PATCH', { archive: false });
}

async function fetchExamResults(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}/results`;
    return performApiCall(URL, 'GET');
}

async function fetchExam(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}`;
    return performApiCall(URL, 'GET');
}

async function fetchExamWithQuestions(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}/with-questions`;
    return performApiCall(URL, 'GET');
}

async function createExam({ name, duration }: { name: string; duration: number | undefined }) {
    const URL = `${BASE_URL}/exams`;
    return performApiCall(URL, 'POST', { name, duration });
}

async function updateExamName({ examId, name }: { examId: string; name: string }) {
    const URL = `${BASE_URL}/exams/${examId}/name`;
    return performApiCall(URL, 'PATCH', { name });
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

async function updateDefaultEdgeText({ kind, text }: { kind: 'start' | 'end'; text: string }) {
    const URL = `${BASE_URL}/user-configurations`;
    return performApiCall(URL, 'PATCH', { kind, text });
}

async function createExercise(params: {
    examId: string;
    name: string;
    instruction: string;
    defaultPoints: number | null;
    defaultQuestionKind: questionKindType;
    order?: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises`;
    return performApiCall(URL, 'POST', {
        name: params.name,
        instruction: params.instruction,
        defaultPoints: params.defaultPoints,
        defaultQuestionKind: params.defaultQuestionKind,
        order: params.order,
    });
}

async function updateExercise(params: {
    examId: string;
    exerciseId: number;
    name: string;
    instruction: string;
    defaultPoints: number | null;
    defaultQuestionKind: questionKindType;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}`;
    return performApiCall(URL, 'PUT', {
        name: params.name,
        instruction: params.instruction,
        defaultPoints: params.defaultPoints,
        defaultQuestionKind: params.defaultQuestionKind,
    });
}

async function deleteExercise(params: { examId: string; exerciseId: number }) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}`;
    return performApiCall(URL, 'DELETE');
}

async function createResetPasswordRequest(email: string) {
    const URL = `${BASE_URL}/reset-password-requests`;
    return performApiCall(URL, 'POST', {
        email,
    });
}

async function fetchResetPasswordRequestUser(resetPasswordRequestId: string) {
    const URL = `${BASE_URL}/reset-password-requests/${resetPasswordRequestId}/user`;
    return performApiCall(URL, 'GET');
}

async function resetPassword({
    password,
    resetPasswordRequestId,
}: {
    password: string;
    resetPasswordRequestId: string;
}) {
    const URL = `${BASE_URL}/reset-password-requests/${resetPasswordRequestId}/user/password`;
    return performApiCall(URL, 'PATCH', { password });
}

async function createQuestion(params: {
    examId: string;
    exerciseId: number;
    title: string;
    kind: questionKindType;
    order?: number;
    possibleAnswers: string[];
    acceptableAnswers: acceptableAnswerType[][];
    points: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}/questions`;
    return performApiCall(URL, 'POST', {
        title: params.title,
        kind: params.kind,
        order: params.order,
        possibleAnswers: params.possibleAnswers,
        acceptableAnswers: params.acceptableAnswers,
        points: params.points,
    });
}

async function updateQuestion(params: {
    examId: string;
    exerciseId: number;
    questionId: number;
    title: string;
    possibleAnswers: string[];
    acceptableAnswers: acceptableAnswerType[][];
    points: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}/questions/${params.questionId}`;
    return performApiCall(URL, 'PUT', {
        title: params.title,
        possibleAnswers: params.possibleAnswers,
        acceptableAnswers: params.acceptableAnswers,
        points: params.points,
    });
}

async function updateQuestionsOrder(params: {
    examId: string;
    exerciseId: number;
    orderedIds: number[];
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}/questions/order`;
    return performApiCall(URL, 'PATCH', {
        orderedIds: params.orderedIds,
    });
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

async function updateEndedAt(params: { attemptId: string }) {
    const URL = `${BASE_URL}/attempts/${params.attemptId}/endedAt`;
    return performApiCall(URL, 'PATCH');
}

async function deleteEndedAt(params: { attemptId: string; examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/attempts/${params.attemptId}/endedAt`;
    return performApiCall(URL, 'DELETE');
}

async function updateCorrectedAt(params: { attemptId: string; examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/attempts/${params.attemptId}/correctedAt`;
    return performApiCall(URL, 'PATCH');
}

async function deleteCorrectedAt(params: { attemptId: string; examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/attempts/${params.attemptId}/correctedAt`;
    return performApiCall(URL, 'DELETE');
}

async function deleteQuestion(params: { examId: string; questionId: number }) {
    const URL = `${BASE_URL}/exams/${params.examId}/questions/${params.questionId}`;
    return performApiCall(URL, 'DELETE');
}

async function duplicateQuestion(params: {
    examId: string;
    questionId: number;
    exerciseId: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}/questions/${params.questionId}/duplicate`;
    return performApiCall(URL, 'POST');
}

async function updateExercisesOrder(params: { examId: string; orderedIds: number[] }) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/order`;
    return performApiCall(URL, 'PATCH', {
        orderedIds: params.orderedIds,
    });
}

async function fetchAttemptsCountByCorrectionStatus(params: { examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/attempts/count-by-correction-status`;
    return performApiCall(URL, 'GET');
}

async function fetchClassesByEstablishment(establishmentId: string) {
    const URL = `${BASE_URL}/establishment/${establishmentId}/classes`;
    return performApiCall(URL, 'GET');
}

async function createClasse(params: { name: string }) {
    const URL = `${BASE_URL}/classes`;
    return performApiCall(URL, 'POST', { name: params.name });
}

async function deleteClasse(params: { classeId: string }) {
    const URL = `${BASE_URL}/classes/${params.classeId}`;
    return performApiCall(URL, 'DELETE');
}

async function changeClasse(params: { classeId: string; studentId: string; newClasseId: string }) {
    const URL = `${BASE_URL}/classes/${params.classeId}/students/${params.studentId}/new-classe/${params.newClasseId}`;
    return performApiCall(URL, 'PATCH');
}

async function duplicateExam(params: { examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/duplicate`;
    return performApiCall(URL, 'POST');
}

async function fetchShouldDisplayRightAnswersForExamId(params: { examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/shouldDisplayRightAnswers`;
    return performApiCall(URL, 'GET');
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

export { api };
