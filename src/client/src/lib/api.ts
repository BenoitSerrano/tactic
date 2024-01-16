import { config } from '../config';
import { acceptableAnswerType, gradeType, questionKindType } from '../types';
import { localStorage } from './localStorage';

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
    fetchStudentByEmailForExam,
    createStudents,
    deleteStudent,
    createExam,
    fetchExam,
    fetchExamWithQuestions,
    updateExamName,
    updateExamDuration,
    fetchExams,
    fetchExamResults,
    deleteExam,
    archiveExam,
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
    updateGrade,
    updateExercisesOrder,
    updateEndedAt,
    deleteEndedAt,
    updateCorrectedAt,
    deleteCorrectedAt,
    createResetPasswordRequest,
    fetchResetPasswordRequestUser,
    resetPassword,
    fetchAttemptsCountByCorrectionStatus,
    fetchGroups,
    createGroup,
    deleteGroup,
    changeGroup,
    duplicateExam,
};

const BASE_URL = `${config.API_URL}/api`;

async function performApiCall(
    url: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    body?: Object,
) {
    let response: Response;
    const token = localStorage.jwtTokenHandler.get();

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
            localStorage.jwtTokenHandler.remove();
        }
        throw new Error(response.statusText);
    }
    return response.json();
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

async function deleteStudent(params: { studentId: string; groupId: string }) {
    const URL = `${BASE_URL}/groups/${params.groupId}/students/${params.studentId}`;
    return performApiCall(URL, 'DELETE');
}

async function fetchStudents(params: { groupId: string }) {
    const URL = `${BASE_URL}/groups/${params.groupId}/students`;
    return performApiCall(URL, 'GET');
}

async function createStudents(params: { emails: string[]; groupId: string }) {
    const URL = `${BASE_URL}/groups/${params.groupId}/students`;
    return performApiCall(URL, 'POST', { emails: params.emails });
}

async function fetchExams() {
    const URL = `${BASE_URL}/exams`;
    return performApiCall(URL, 'GET');
}

async function deleteExam(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}`;
    return performApiCall(URL, 'DELETE');
}

async function archiveExam(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}/archivedAt`;
    return performApiCall(URL, 'PATCH');
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

async function createExercise(params: {
    examId: string;
    name: string;
    instruction: string;
    defaultPoints: number;
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
    defaultPoints: number;
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

async function updateGrade(params: {
    examId: string;
    attemptId: string;
    questionId: number;
    grade: gradeType;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/attempts/${params.attemptId}/questions/${params.questionId}/grade`;
    return performApiCall(URL, 'PATCH', {
        grade: params.grade,
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

async function fetchGroups() {
    const URL = `${BASE_URL}/groups`;
    return performApiCall(URL, 'GET');
}

async function createGroup(params: { name: string }) {
    const URL = `${BASE_URL}/groups`;
    return performApiCall(URL, 'POST', { name: params.name });
}

async function deleteGroup(params: { groupId: string }) {
    const URL = `${BASE_URL}/groups/${params.groupId}`;
    return performApiCall(URL, 'DELETE');
}

async function changeGroup(params: { groupId: string; studentId: string; newGroupId: string }) {
    const URL = `${BASE_URL}/groups/${params.groupId}/students/${params.studentId}/new-group/${params.newGroupId}`;
    return performApiCall(URL, 'PATCH');
}

async function duplicateExam(params: { examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/duplicate`;
    return performApiCall(URL, 'POST');
}

export { api };
