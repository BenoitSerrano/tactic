import { config } from '../config';

const api = {
    patchComment,
    createOrUpdateQcmAnswer,
    createOrUpdateQuestionTrouAnswer,
    searchAttempt,
    createAttempt,
    createEmptyAttempt,
    fetchAttempt,
    updateAttemptTreatementStatus,
    deleteAttempt,
    fetchStudents,
    fetchStudentId,
    createStudent,
    createStudents,
    deleteStudent,
    createExam,
    fetchExam,
    fetchExams,
    fetchExamResults,
    createQuestionChoixMultiple,
    updateQuestionChoixMultiple,
    createQuestionTrou,
    updateQuestionTrou,
    createPhraseMelangee,
    updatePhraseMelangee,
    createOrUpdatePhraseMelangeeAnswer,
};

const BASE_URL = `${config.API_URL}/api`;

async function patchComment(studentId: string, comment: string) {
    const URL = `${BASE_URL}/students/${studentId}`;
    const response = await fetch(URL, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
    });
    return response.json();
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
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer }),
    });
    return response.json();
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
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer }),
    });
    return response.json();
}

async function searchAttempt({ examId, studentId }: { examId: string; studentId: string }) {
    const URL = `${BASE_URL}/exams/${examId}/students/${studentId}/attempts`;
    const response = await fetch(URL, {
        method: 'GET',
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

async function createEmptyAttempt({ examId, studentId }: { examId: string; studentId: string }) {
    const URL = `${BASE_URL}/exams/${examId}/students/${studentId}/empty-attempt`;
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

async function updateAttemptTreatementStatus({
    attemptId,
    hasBeenTreated,
}: {
    attemptId: string;
    hasBeenTreated: boolean;
}) {
    const URL = `${BASE_URL}/attempts/${attemptId}/hasBeenTreated`;
    const response = await fetch(URL, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hasBeenTreated }),
    });
    return response.json();
}

async function deleteAttempt(attemptId: string) {
    const URL = `${BASE_URL}/attempts/${attemptId}`;
    const response = await fetch(URL, {
        method: 'DELETE',
    });
    return response.json();
}

async function fetchStudentId(email: string) {
    const URL = `${BASE_URL}/students/${email}`;
    const response = await fetch(URL, {
        method: 'GET',
    });
    return response.json();
}

async function deleteStudent(studentId: string) {
    const URL = `${BASE_URL}/students/${studentId}`;
    const response = await fetch(URL, {
        method: 'DELETE',
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

async function createExam({ name, duration }: { name: string; duration: number }) {
    const URL = `${BASE_URL}/exams`;
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, duration }),
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
    qcmId: number;
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

async function createQuestionTrou(examId: string) {
    const URL = `${BASE_URL}/exams/${examId}/questions-trou`;
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
    return response.json();
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
    const body = JSON.stringify({
        beforeText: params.beforeText,
        afterText: params.afterText,
        rightAnswers: params.rightAnswers,
        acceptableAnswers: params.acceptableAnswers,
        points: params.points,
    });
    const response = await fetch(URL, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: body,
    });
    return response.json();
}

async function createPhraseMelangee(params: {
    examId: string;
    words: string[];
    correctPhrases: string[];
    shuffledPhrase: string;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/phrases-melangees`;
    const body = JSON.stringify({
        correctPhrases: params.correctPhrases,
        shuffledPhrase: params.shuffledPhrase,
        words: params.words,
    });
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body,
    });
    return response.json();
}

async function updatePhraseMelangee(params: {
    examId: string;
    phraseMelangeeId: number;
    words: string[];
    correctPhrases: string[];
    shuffledPhrase: string;
}) {
    const URL = `${BASE_URL}/exams/${params.examId}/phrases-melangees/${params.phraseMelangeeId}`;
    const body = JSON.stringify({
        correctPhrases: params.correctPhrases,
        shuffledPhrase: params.shuffledPhrase,
        words: params.words,
    });
    const response = await fetch(URL, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body,
    });
    return response.json();
}

export { api };
