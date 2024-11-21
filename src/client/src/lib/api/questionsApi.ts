import { acceptableAnswerType, questionKindType } from '../../types';
import { BASE_URL } from './constants';
import { performApiCall } from './lib/performApiCall';

const questionsApi = {
    updateQuestionsOrder,
    addAcceptableAnswerToQuestion,
    addAcceptableAnswerToQuestionTexteATrous,
    removeOkAnswerFromQuestionTexteATrous,
    removeOkAnswerFromQuestion,
    updateQuestion,
    createQuestion,
    deleteQuestion,
};

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

// TODO: ajouter l'exerciseId pour s'assurer qu'on est pas en train de faire de la merde
async function addAcceptableAnswerToQuestion({
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
async function addAcceptableAnswerToQuestionTexteATrous({
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
async function removeOkAnswerFromQuestion({
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

async function removeOkAnswerFromQuestionTexteATrous({
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

async function deleteQuestion(params: { examId: string; questionId: number }) {
    const URL = `${BASE_URL}/exams/${params.examId}/questions/${params.questionId}`;
    return performApiCall(URL, 'DELETE');
}

export { questionsApi };
