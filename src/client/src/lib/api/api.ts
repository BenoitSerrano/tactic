import { config } from '../../config';
import { acceptableAnswerType, questionKindType } from '../../types';
import { localSessionHandler } from '../localSessionHandler';

const api = {
    updateDefaultEdgeText,
    createQuestion,
    updateQuestion,
    addQuestionAcceptableAnswer,
    addQuestionAcceptableAnswerToTexteATrous,
    removeOkAnswer,
    removeOkAnswerFromTexteATrous,
    deleteQuestion,
    duplicateQuestion,
    updateQuestionsOrder,
    createResetPasswordRequest,
    fetchResetPasswordRequestUser,
    resetPassword,
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

async function updateDefaultEdgeText({ kind, text }: { kind: 'start' | 'end'; text: string }) {
    const URL = `${BASE_URL}/user-configurations`;
    return performApiCall(URL, 'PATCH', { kind, text });
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

export { api };
