import { config } from '../config';

const api = {
    createAttempt,
    fetchStudents,
    createStudent,
    createExam,
    fetchExam,
    fetchExams,
    createQuestionChoixMultiple,
    updateQuestionChoixMultiple,
};

const BASE_URL = `${config.API_URL}/api`;

async function createAttempt({ examId, studentId }: { examId: string; studentId: string }) {
    const URL = `${BASE_URL}/exams/${examId}/students/${studentId}/attempts`;
    const response = await fetch(URL, {
        method: 'POST',
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

async function createStudent({ firstName, lastName }: { firstName: string; lastName: string }) {
    const URL = `${BASE_URL}/students`;
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName }),
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
