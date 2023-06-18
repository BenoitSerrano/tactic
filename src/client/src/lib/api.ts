import { config } from '../config';

const api = {
    createOrUpdateQcmAnswer,
    createAttempt,
    fetchAttempt,
    fetchStudents,
    createStudent,
    createStudents,
    createExam,
    fetchExam,
    fetchExams,
    fetchExamResults,
    createQuestionChoixMultiple,
    updateQuestionChoixMultiple,
};

const BASE_URL = `${config.API_URL}/api`;

async function createOrUpdateQcmAnswer({
    attemptId,
    qcmId,
    choice,
}: {
    attemptId: string;
    qcmId: string;
    choice: number;
}) {
    const URL = `${BASE_URL}/attempts/${attemptId}/questionsChoixMultiple/${qcmId}`;
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ choice }),
    });
    return response.json();
}

async function createAttempt({ examId, studentId }: { examId: string; studentId: string }) {
    const URL = `${BASE_URL}/exams/${examId}/students/${studentId}/attempts`;
    const response = await fetch(URL, {
        method: 'POST',
    });
    return response.json();
}

async function fetchAttempt(attemptId: string) {
    const URL = `${BASE_URL}/attempts/${attemptId}`;
    const response = await fetch(URL, {
        method: 'GET',
    });
    return response.json();
}

async function fetchStudents() {
    const URL = `${BASE_URL}/students`;
    const response = await fetch(URL, {
        method: 'GET',
    });
    return response.json();
}

async function createStudent(email: string) {
    const URL = `${BASE_URL}/students`;
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    return response.json();
}

async function createStudents(emails: string[]) {
    const URL = `${BASE_URL}/student-list`;
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails }),
    });
    return response.json();
}

async function fetchExams() {
    const URL = `${BASE_URL}/exams`;
    const response = await fetch(URL, {
        method: 'GET',
    });
    return response.json();
}

async function fetchExamResults(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}/results`;
    const response = await fetch(URL, {
        method: 'GET',
    });
    return response.json();
}

async function fetchExam(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}`;
    const response = await fetch(URL, {
        method: 'GET',
    });
    return response.json();
}

async function createExam(name: string) {
    const URL = `${BASE_URL}/exams`;
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });
    return response.json();
}

async function createQuestionChoixMultiple(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}/questions-choix-multiple`;
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

async function updateQuestionChoixMultiple(params: {
    examId: string;
    qcmId: string;
    title: string;
    possibleAnswers: string[];
    rightAnswerIndex: number;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/questions-choix-multiple/${params.qcmId}`;
    const body = JSON.stringify({
        title: params.title,
        possibleAnswers: params.possibleAnswers,
        rightAnswerIndex: params.rightAnswerIndex,
    });
    const response = await fetch(URL, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: body,
    });
    return response.json();
}

export { api };
