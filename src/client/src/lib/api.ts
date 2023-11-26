import { config } from '../config';
import { questionKindType } from '../types';
import { localStorage } from './localStorage';

const api = {
    login,
    createUser,
    patchComment,
    searchAttempt,
    createAttempt,
    fetchAttemptWithAnswers,
    fetchAttemptWithoutAnswers,
    fetchExamWithoutAnswers,
    updateAttempt,
    updateAttemptCheatingSummary,
    deleteAttempt,
    fetchStudents,
    fetchStudentByEmail,
    createStudents,
    deleteStudent,
    createExam,
    fetchExam,
    updateExam,
    fetchExams,
    fetchExamResults,
    deleteExam,
    createQuestion,
    fetchExercise,
    createExercise,
    updateExercise,
    deleteExercise,
    updateQuestion,
    addQuestionRightAnswer,
    addQuestionAcceptableAnswer,
    removeOkAnswer,
    deleteQuestion,
    updateQuestionsOrder,
    updateMark,
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

async function patchComment(studentId: string, comment: string) {
    const URL = `${BASE_URL}/students/${studentId}`;
    return performApiCall(URL, 'PATCH', { comment });
}

async function searchAttempt({ examId, studentId }: { examId: string; studentId: string }) {
    const URL = `${BASE_URL}/exams/${examId}/students/${studentId}/attempts`;
    return performApiCall(URL, 'GET');
}

async function createAttempt({ examId, studentId }: { examId: string; studentId: string }) {
    const URL = `${BASE_URL}/exams/${examId}/students/${studentId}/attempts`;
    return performApiCall(URL, 'POST', {});
}

async function fetchAttemptWithAnswers(attemptId: string) {
    const URL = `${BASE_URL}/attempts/${attemptId}/with-answers`;
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
async function addQuestionRightAnswer({
    examId,
    questionId,
    rightAnswer,
}: {
    examId: string;
    questionId: number;
    rightAnswer: string;
}) {
    const URL = `${BASE_URL}/exams/${examId}/questions/${questionId}/right-answers`;
    return performApiCall(URL, 'POST', { rightAnswer });
}

// TODO: ajouter l'exerciseId pour s'assurer qu'on est pas en train de faire de la merde
async function addQuestionAcceptableAnswer({
    examId,
    questionId,
    acceptableAnswer,
}: {
    examId: string;
    questionId: number;
    acceptableAnswer: string;
}) {
    const URL = `${BASE_URL}/exams/${examId}/questions/${questionId}/acceptable-answers`;
    return performApiCall(URL, 'POST', { acceptableAnswer });
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

async function deleteAttempt(attemptId: string) {
    const URL = `${BASE_URL}/attempts/${attemptId}`;
    return performApiCall(URL, 'DELETE');
}

async function fetchStudentByEmail(email: string) {
    const URL = `${BASE_URL}/students/${email}`;
    return performApiCall(URL, 'GET');
}

async function deleteStudent(studentId: string) {
    const URL = `${BASE_URL}/students/${studentId}`;
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

async function fetchExamResults(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}/results`;
    return performApiCall(URL, 'GET');
}

async function fetchExam(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}`;
    return performApiCall(URL, 'GET');
}

async function createExam({ name, duration }: { name: string; duration: number }) {
    const URL = `${BASE_URL}/exams`;
    return performApiCall(URL, 'POST', { name, duration });
}

async function updateExam({
    examId,
    name,
    duration,
}: {
    examId: string;
    name: string;
    duration: number;
}) {
    const URL = `${BASE_URL}/exams/${examId}`;
    return performApiCall(URL, 'PUT', { name, duration });
}

async function fetchExercise(params: { examId: string; exerciseId: number }) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}`;
    return performApiCall(URL, 'GET');
}

async function createExercise(params: {
    examId: string;
    name: string;
    instruction: string;
    defaultPoints: number;
    defaultQuestionKind: questionKindType;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises`;
    return performApiCall(URL, 'POST', {
        name: params.name,
        instruction: params.instruction,
        defaultPoints: params.defaultPoints,
        defaultQuestionKind: params.defaultQuestionKind,
    });
}

async function updateExercise(params: {
    examId: string;
    exerciseId: number;
    name: string;
    instruction: string;
    defaultPoints: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}`;
    return performApiCall(URL, 'PUT', {
        name: params.name,
        instruction: params.instruction,
        defaultPoints: params.defaultPoints,
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
    possibleAnswers: string[];
    rightAnswers: string[];
    acceptableAnswers: string[];
    points: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}/questions`;
    return performApiCall(URL, 'POST', {
        title: params.title,
        kind: params.kind,
        possibleAnswers: params.possibleAnswers,
        rightAnswers: params.rightAnswers,
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
    rightAnswers: string[];
    acceptableAnswers: string[];
    points: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}/questions/${params.questionId}`;
    return performApiCall(URL, 'PUT', {
        title: params.title,
        possibleAnswers: params.possibleAnswers,
        rightAnswers: params.rightAnswers,
        acceptableAnswers: params.acceptableAnswers,
        points: params.points,
    });
}

async function updateQuestionsOrder(params: {
    examId: string;
    exerciseId: number;
    orders: Array<{ id: number; order: number }>;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}/questions/order`;
    return performApiCall(URL, 'PATCH', {
        orders: params.orders,
    });
}

async function updateMark(params: { attemptId: string; questionId: number; mark: number }) {
    const URL = `${BASE_URL}/attempts/${params.attemptId}/${params.questionId}/mark`;
    return performApiCall(URL, 'PATCH', {
        mark: params.mark,
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

async function updateExercisesOrder(params: {
    examId: string;
    orders: Array<{ id: number; order: number }>;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/order`;
    return performApiCall(URL, 'PATCH', {
        orders: params.orders,
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

export { api };
