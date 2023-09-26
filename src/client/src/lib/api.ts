import { config } from '../config';
import { localStorage } from './localStorage';

const api = {
    login,
    createUser,
    patchComment,
    createOrUpdateQcmAnswer,
    createOrUpdateQuestionTrouAnswer,
    searchAttempt,
    createAttempt,
    createEmptyAttempt,
    fetchAttempt,
    fetchAttemptWithoutAnswers,
    updateAttemptTreatementStatus,
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
    createQuestionChoixMultiple,
    updateQuestionChoixMultiple,
    createQuestionTrou,
    updateQuestionTrou,
    createPhraseMelangee,
    updatePhraseMelangee,
    createOrUpdatePhraseMelangeeAnswer,
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
        response = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
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

async function createOrUpdateQcmAnswer({
    attemptId,
    qcmId,
    choice,
}: {
    attemptId: string;
    qcmId: string;
    choice: number;
}) {
    const URL = `${BASE_URL}/attempts/${attemptId}/questions-choix-multiple/${qcmId}`;
    return performApiCall(URL, 'POST', { choice });
}

async function createOrUpdateQuestionTrouAnswer({
    attemptId,
    questionTrouId,
    answer,
}: {
    attemptId: string;
    questionTrouId: number;
    answer: string;
}) {
    const URL = `${BASE_URL}/attempts/${attemptId}/questions-trou/${questionTrouId}`;
    return performApiCall(URL, 'POST', { answer });
}

async function createOrUpdatePhraseMelangeeAnswer({
    attemptId,
    phraseMelangeeId,
    answer,
}: {
    attemptId: string;
    phraseMelangeeId: number;
    answer: string;
}) {
    const URL = `${BASE_URL}/attempts/${attemptId}/phrases-melangees/${phraseMelangeeId}`;
    return performApiCall(URL, 'POST', { answer });
}

async function searchAttempt({ examId, studentId }: { examId: string; studentId: string }) {
    const URL = `${BASE_URL}/exams/${examId}/students/${studentId}/attempts`;
    return performApiCall(URL, 'GET');
}

async function createAttempt({ examId, studentId }: { examId: string; studentId: string }) {
    const URL = `${BASE_URL}/exams/${examId}/students/${studentId}/attempts`;
    return performApiCall(URL, 'POST', {});
}

async function createEmptyAttempt({ examId, studentId }: { examId: string; studentId: string }) {
    const URL = `${BASE_URL}/exams/${examId}/students/${studentId}/empty-attempt`;
    return performApiCall(URL, 'POST', {});
}

async function fetchAttempt(attemptId: string) {
    const URL = `${BASE_URL}/attempts/${attemptId}`;
    return performApiCall(URL, 'GET');
}

async function fetchAttemptWithoutAnswers(attemptId: string) {
    const URL = `${BASE_URL}/attempts/${attemptId}/without-answers`;
    return performApiCall(URL, 'GET');
}

async function updateAttemptTreatementStatus({
    attemptId,
    hasBeenTreated,
}: {
    attemptId: string;
    hasBeenTreated: boolean;
}) {
    const URL = `${BASE_URL}/attempts/${attemptId}/has-been-treated`;
    return performApiCall(URL, 'PATCH', { hasBeenTreated });
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

async function createQuestionChoixMultiple(params: {
    examId: string;
    title: string;
    possibleAnswers: string[];
    rightAnswerIndex: number;
    points: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/questions-choix-multiple`;
    return performApiCall(URL, 'POST', {
        title: params.title,
        possibleAnswers: params.possibleAnswers,
        rightAnswerIndex: params.rightAnswerIndex,
        points: params.points,
    });
}

async function updateQuestionChoixMultiple(params: {
    examId: string;
    qcmId: number;
    title: string;
    possibleAnswers: string[];
    rightAnswerIndex: number;
    points: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/questions-choix-multiple/${params.qcmId}`;
    return performApiCall(URL, 'PUT', {
        title: params.title,
        possibleAnswers: params.possibleAnswers,
        rightAnswerIndex: params.rightAnswerIndex,
        points: params.points,
    });
}

async function createQuestionTrou(params: {
    examId: string;
    beforeText: string;
    afterText: string;
    rightAnswers: string[];
    acceptableAnswers: string[];
    points: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/questions-trou`;
    return performApiCall(URL, 'POST', {
        beforeText: params.beforeText,
        afterText: params.afterText,
        rightAnswers: params.rightAnswers,
        acceptableAnswers: params.acceptableAnswers,
        points: params.points,
    });
}

async function updateQuestionTrou(params: {
    examId: string;
    questionTrouId: number;
    beforeText?: string;
    afterText?: string;
    rightAnswers?: string[];
    acceptableAnswers?: string[];
    points?: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/questions-trou/${params.questionTrouId}`;
    return performApiCall(URL, 'PATCH', {
        beforeText: params.beforeText,
        afterText: params.afterText,
        rightAnswers: params.rightAnswers,
        acceptableAnswers: params.acceptableAnswers,
        points: params.points,
    });
}

async function createPhraseMelangee(params: {
    examId: string;
    words: string[];
    correctPhrases: string[];
    shuffledPhrase: string;
    points: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/phrases-melangees`;
    return performApiCall(URL, 'POST', {
        correctPhrases: params.correctPhrases,
        shuffledPhrase: params.shuffledPhrase,
        words: params.words,
        points: params.points,
    });
}

async function updatePhraseMelangee(params: {
    examId: string;
    phraseMelangeeId: number;
    words: string[];
    correctPhrases: string[];
    shuffledPhrase: string;
    points: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/phrases-melangees/${params.phraseMelangeeId}`;
    return performApiCall(URL, 'PUT', {
        correctPhrases: params.correctPhrases,
        shuffledPhrase: params.shuffledPhrase,
        words: params.words,
        points: params.points,
    });
}

export { api };
