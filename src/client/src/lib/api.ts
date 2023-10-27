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
    updateAttempt,
    updateAttemptCheatingSummary,
    deleteAttempt,
    fetchStudents,
    fetchStudentId,
    createStudents,
    deleteStudent,
    createExam,
    fetchExam,
    fetchExams,
    fetchExamResults,
    deleteExam,
    createQuestion,
    fetchExercise,
    createExercise,
    updateExercise,
    deleteExercise,
    updateQuestion,
    deleteQuestion,
    swapQuestions,
    updateMarks,
    swapExercises,
    updateEndedAt,
};

const BASE_URL = `${config.API_URL}/api`;

async function performApiCall(
    url: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    body?: Object,
) {
    let response: Response;
    const token = localStorage.jwtTokenHandler.get();

    if (method === 'GET' || method === 'DELETE') {
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

async function fetchAttemptWithoutAnswers(attemptId: string) {
    const URL = `${BASE_URL}/attempts/${attemptId}/without-answers`;
    return performApiCall(URL, 'GET');
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

async function fetchStudentId(email: string) {
    const URL = `${BASE_URL}/students/${email}`;
    return performApiCall(URL, 'GET');
}

async function deleteStudent(studentId: string) {
    const URL = `${BASE_URL}/students/${studentId}`;
    return performApiCall(URL, 'DELETE');
}

async function fetchStudents() {
    const URL = `${BASE_URL}/students`;
    return performApiCall(URL, 'GET');
}

async function createStudents(emails: string[]) {
    const URL = `${BASE_URL}/student-list`;
    return performApiCall(URL, 'POST', { emails });
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

async function fetchExercise(params: { examId: string; exerciseId: number }) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}`;
    return performApiCall(URL, 'GET');
}

async function createExercise(params: {
    examId: string;
    name: string;
    instruction: string;
    defaultPoints: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises`;
    return performApiCall(URL, 'POST', {
        name: params.name,
        instruction: params.instruction,
        defaultPoints: params.defaultPoints,
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

async function swapQuestions(params: {
    examId: string;
    exerciseId: number;
    questionId1: number;
    questionId2: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/${params.exerciseId}/questions/order`;
    return performApiCall(URL, 'PATCH', {
        questionId1: params.questionId1,
        questionId2: params.questionId2,
    });
}

async function updateMarks(params: { attemptId: string; marks: Record<number, number> }) {
    const URL = `${BASE_URL}/attempts/${params.attemptId}/marks`;
    return performApiCall(URL, 'PATCH', {
        marks: params.marks,
    });
}

async function updateEndedAt(params: { attemptId: string }) {
    const URL = `${BASE_URL}/attempts/${params.attemptId}/endedAt`;
    return performApiCall(URL, 'PATCH');
}

async function deleteQuestion(params: { examId: string; questionId: number }) {
    const URL = `${BASE_URL}/exams/${params.examId}/questions/${params.questionId}`;
    return performApiCall(URL, 'DELETE');
}

async function swapExercises(params: { examId: string; exerciseId1: number; exerciseId2: number }) {
    const URL = `${BASE_URL}/exams/${params.examId}/exercises/order`;
    return performApiCall(URL, 'PATCH', {
        exerciseId1: params.exerciseId1,
        exerciseId2: params.exerciseId2,
    });
}

export { api };
